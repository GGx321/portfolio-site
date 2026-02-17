'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import { ORDER_QUESTIONS } from '@/config/order-form';
import styles from './OrderModal.module.css';

export type ContactMethod = 'telegram' | 'email';

export interface OrderFormState {
  answers: Record<string, string>;
  description: string;
  contactMethod: ContactMethod | null;
  name: string;
  phone: string;
  telegramUsername: string;
  email: string;
}

const initialState: OrderFormState = {
  answers: {},
  description: '',
  contactMethod: null,
  name: '',
  phone: '',
  telegramUsername: '',
  email: '',
};

type Props = { open: boolean; onClose: () => void };

export function OrderModal({ open, onClose }: Props) {
  const t = useTranslations('orderModal');
  const tq = useTranslations('orderQuestions');
  const [state, setState] = useState<OrderFormState>(initialState);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const totalSteps = ORDER_QUESTIONS.length + 3;
  const isQuestionStep = step < ORDER_QUESTIONS.length;
  const isDescriptionStep = step === ORDER_QUESTIONS.length;
  const isContactMethodStep = step === ORDER_QUESTIONS.length + 1;
  const isContactFieldsStep = step === ORDER_QUESTIONS.length + 2;

  const reset = useCallback(() => {
    setState(initialState);
    setStep(0);
    setStatus('idle');
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(reset, 300);
  }, [onClose, reset]);

  const setAnswer = (questionId: string, optionId: string) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: optionId } }));
  };

  const canProceed = () => {
    if (isQuestionStep) {
      const q = ORDER_QUESTIONS[step];
      return !!state.answers[q.id];
    }
    if (isDescriptionStep) return !!state.description.trim();
    if (isContactMethodStep) return !!state.contactMethod;
    if (isContactFieldsStep) {
      if (!state.name.trim()) return false;
      if (state.contactMethod === 'telegram') return !!state.phone.trim();
      return !!state.email.trim();
    }
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(state.answers).map(([questionId, optionId]) => ({
            questionId,
            optionId,
          })),
          description: state.description.trim() || undefined,
          contactMethod: state.contactMethod,
          name: state.name.trim(),
          phone: state.phone.trim() || undefined,
          telegramUsername: state.telegramUsername.trim() || undefined,
          email: state.email.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="order-modal-title">{t('title')}</h2>
          <button type="button" onClick={handleClose} className={styles.close} aria-label={t('close')}>
            ×
          </button>
        </div>

        {status === 'success' && (
          <div className={styles.body}>
            <p className={styles.successMessage}>{t('successMessage')}</p>
            <button type="button" onClick={handleClose} className={styles.ctaButton}>
              {t('close')}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.body}>
            <p className={styles.errorMessage}>{t('errorMessage')}</p>
            <button type="button" onClick={() => setStatus('idle')} className={styles.ctaButton}>
              {t('back')}
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className={styles.body}>
            <p className={styles.stepLabel}>…</p>
          </div>
        )}

        {status === 'idle' && (
          <div className={styles.body}>
            {isQuestionStep && (
              <QuestionStep
                question={ORDER_QUESTIONS[step]}
                value={state.answers[ORDER_QUESTIONS[step].id]}
                onSelect={(optionId) => setAnswer(ORDER_QUESTIONS[step].id, optionId)}
                tq={tq}
              />
            )}
            {isDescriptionStep && (
              <DescriptionStep
                value={state.description}
                onChange={(v) => setState((s) => ({ ...s, description: v }))}
                t={t}
              />
            )}
            {isContactMethodStep && (
              <ContactMethodStep
                value={state.contactMethod}
                onChange={(m) => setState((s) => ({ ...s, contactMethod: m }))}
                t={t}
              />
            )}
            {isContactFieldsStep && (
              <ContactFieldsStep state={state} setState={setState} t={t} />
            )}

            <div className={styles.footer}>
              {step > 0 && (
                <button type="button" onClick={handleBack} className={styles.secondaryButton}>
                  {t('back')}
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.ctaButton}
                  disabled={!canProceed()}
                >
                  {t('next')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={styles.ctaButton}
                  disabled={!canProceed()}
                >
                  {t('submit')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionStep({
  question,
  value,
  onSelect,
  tq,
}: {
  question: (typeof ORDER_QUESTIONS)[0];
  value: string | undefined;
  onSelect: (id: string) => void;
  tq: (key: string) => string;
}) {
  return (
    <>
      <p className={styles.stepLabel}>{tq(`${question.id}.label`)}</p>
      <div className={styles.options}>
        {question.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={value === opt.id ? styles.optionActive : styles.option}
            onClick={() => onSelect(opt.id)}
          >
            {tq(`${question.id}.${opt.id}`)}
          </button>
        ))}
      </div>
    </>
  );
}

function DescriptionStep({
  value,
  onChange,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  t: (key: string) => string;
}) {
  return (
    <div className={styles.contactFields}>
      <label>
        <span>{t('descriptionLabel')}</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required
        />
      </label>
    </div>
  );
}

function ContactMethodStep({
  value,
  onChange,
  t,
}: {
  value: ContactMethod | null;
  onChange: (m: ContactMethod) => void;
  t: (key: string) => string;
}) {
  return (
    <>
      <p className={styles.stepLabel}>{t('contactMethod')}</p>
      <div className={styles.options}>
        <button
          type="button"
          className={value === 'telegram' ? styles.optionActive : styles.option}
          onClick={() => onChange('telegram')}
        >
          {t('telegram')}
        </button>
        <button
          type="button"
          className={value === 'email' ? styles.optionActive : styles.option}
          onClick={() => onChange('email')}
        >
          {t('email')}
        </button>
      </div>
    </>
  );
}

function ContactFieldsStep({
  state,
  setState,
  t,
}: {
  state: OrderFormState;
  setState: React.Dispatch<React.SetStateAction<OrderFormState>>;
  t: (key: string) => string;
}) {
  return (
    <div className={styles.contactFields}>
      <label>
        <span>{t('yourName')}</span>
        <input
          type="text"
          value={state.name}
          onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
          required
        />
      </label>
      {state.contactMethod === 'telegram' && (
        <>
          <label>
            <span>{t('phone')}</span>
            <input
              type="tel"
              value={state.phone}
              onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
            />
          </label>
          <label>
            <span>{t('telegramUsername')}</span>
            <input
              type="text"
              placeholder="@username"
              value={state.telegramUsername}
              onChange={(e) => setState((s) => ({ ...s, telegramUsername: e.target.value }))}
            />
          </label>
        </>
      )}
      {state.contactMethod === 'email' && (
        <label>
          <span>{t('yourEmail')}</span>
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          />
        </label>
      )}
    </div>
  );
}
