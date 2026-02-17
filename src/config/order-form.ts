/**
 * Questions and options for the "Order project" form.
 * Cost mapping: see cost-mapping.ts — map combination of option IDs to approximate price.
 */
export interface OrderQuestionOption {
  id: string;
  labelKey: string;
}

export interface OrderQuestion {
  id: string;
  labelKey: string;
  options: OrderQuestionOption[];
}

export const ORDER_QUESTIONS: OrderQuestion[] = [
  {
    id: 'project_type',
    labelKey: 'orderQuestions.project_type.label',
    options: [
      { id: 'site', labelKey: 'orderQuestions.project_type.site' },
      { id: 'shop', labelKey: 'orderQuestions.project_type.shop' },
      { id: 'tg_bot', labelKey: 'orderQuestions.project_type.tg_bot' },
      { id: 'tg_miniapp', labelKey: 'orderQuestions.project_type.tg_miniapp' },
      { id: 'web3', labelKey: 'orderQuestions.project_type.web3' },
    ],
  },
  {
    id: 'has_design',
    labelKey: 'orderQuestions.has_design.label',
    options: [
      { id: 'yes', labelKey: 'orderQuestions.has_design.yes' },
      { id: 'no', labelKey: 'orderQuestions.has_design.no' },
      { id: 'example', labelKey: 'orderQuestions.has_design.example' },
    ],
  },
];
