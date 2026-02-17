export interface OrderQuestionOption {
  id: string;
}

export interface OrderQuestion {
  id: string;
  options: OrderQuestionOption[];
}

export const ORDER_QUESTIONS: OrderQuestion[] = [
  {
    id: "project_type",
    options: [
      { id: "site" },
      { id: "shop" },
      { id: "tg_bot" },
      { id: "tg_miniapp" },
      { id: "web3" },
    ],
  },
  {
    id: "has_design",
    options: [
      { id: "yes" },
      { id: "no" },
      { id: "example" },
    ],
  },
];
