"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/context";
import { ORDER_QUESTIONS } from "@/config/order-form";
import { getApproximateCost } from "@/config/cost-mapping";

interface AnswerItem {
  questionId: string;
  optionId: string;
}

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = ["questions", "description", "contact", "done"] as const;

export function OrderModal({ open, onOpenChange }: OrderModalProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<(typeof STEPS)[number]>("questions");
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [description, setDescription] = useState("");
  const [contactMethod, setContactMethod] = useState<"telegram" | "email">("telegram");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionsLabels = t.orderQuestions as Record<string, Record<string, string>>;

  const handleSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const rest = prev.filter((a) => a.questionId !== questionId);
      return [...rest, { questionId, optionId }];
    });
  }, []);

  const answersMap = Object.fromEntries(answers.map((a) => [a.questionId, a.optionId]));
  const costKey = ["project_type", "has_design"].map((id) => answersMap[id]).filter(Boolean);
  const costLabel = costKey.length === 2 ? getApproximateCost(costKey) : null;
  const canProceedFromQuestions = ORDER_QUESTIONS.every((q) => answers.some((a) => a.questionId === q.id));

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("questions");
      setAnswers([]);
      setDescription("");
      setContactMethod("telegram");
      setName("");
      setPhone("");
      setTelegramUsername("");
      setEmail("");
      setError(null);
    }, 200);
  }, [onOpenChange]);

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }, [step]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }, [step]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          description: description.trim() || undefined,
          contactMethod,
          name: name.trim(),
          phone: phone.trim() || undefined,
          telegramUsername: telegramUsername.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || t.orderModal.errorMessage);
        return;
      }
      setStep("done");
    } catch {
      setError(t.orderModal.errorMessage);
    } finally {
      setLoading(false);
    }
  }, [answers, description, contactMethod, name, phone, telegramUsername, email, t.orderModal.errorMessage]);

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? handleClose() : onOpenChange(v))}>
      <DialogContent showClose={step !== "done"} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.orderModal.title}</DialogTitle>
        </DialogHeader>

        {step === "questions" && (
          <div className="space-y-6">
            {ORDER_QUESTIONS.map((q) => (
              <div key={q.id}>
                <p className="text-sm font-medium mb-2">{questionsLabels[q.id]?.label ?? q.id}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = answers.find((a) => a.questionId === q.id)?.optionId === opt.id;
                    return (
                      <Button
                        key={opt.id}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelect(q.id, opt.id)}
                      >
                        {questionsLabels[q.id]?.[opt.id] ?? opt.id}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
            {costLabel && (
              <p className="text-sm text-muted-foreground">
                {t.orderModal.approximateCost}: {costLabel}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button onClick={goNext} disabled={!canProceedFromQuestions}>
                {t.orderModal.next}
              </Button>
            </div>
          </div>
        )}

        {step === "description" && (
          <div className="space-y-4">
            <label className="text-sm font-medium">{t.orderModal.descriptionLabel}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.orderModal.descriptionLabel}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={goBack}>
                {t.orderModal.back}
              </Button>
              <Button onClick={goNext}>{t.orderModal.next}</Button>
            </div>
          </div>
        )}

        {step === "contact" && (
          <div className="space-y-4">
            <p className="text-sm font-medium">{t.orderModal.contactMethod}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={contactMethod === "telegram" ? "default" : "outline"}
                size="sm"
                onClick={() => setContactMethod("telegram")}
              >
                {t.orderModal.telegram}
              </Button>
              <Button
                type="button"
                variant={contactMethod === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setContactMethod("email")}
              >
                {t.orderModal.email}
              </Button>
            </div>
            <Input
              placeholder={t.orderModal.yourName}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {contactMethod === "telegram" && (
              <>
                <Input
                  placeholder={t.orderModal.phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  placeholder={t.orderModal.telegramUsername}
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                />
              </>
            )}
            {contactMethod === "email" && (
              <Input
                type="email"
                placeholder={t.orderModal.yourEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-between">
              <Button variant="outline" onClick={goBack}>
                {t.orderModal.back}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name.trim() || (contactMethod === "telegram" ? !phone.trim() : !email.trim()) || loading}
              >
                {t.orderModal.submit}
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">{t.orderModal.successMessage}</p>
            <Button className="mt-4" onClick={handleClose}>
              {t.orderModal.close}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
