"use client";

import { Accordion } from "@base-ui/react/accordion";
import { IconChevronDown, IconQuestionMark } from "@tabler/icons-react";
import Button from "../components/Button";
import NavBar from "../components/NavBar";

const FAQS = [
  {
    id: "revoke-consent",
    question: "How do I revoke my CIBIL consent?",
    answer:
      'To revoke your consent for accessing your CIBIL report, please email support@lazypay.in using the subject line "Revoke My CIBIL Consent." If you do not receive a response within 48 hours of raising your request, you can escalate the matter to our grievance officer, who will respond within 24 hours of the escalation.',
  },
  {
    id: "grievances",
    question: "How can I get my grievances addressed for my CIBIL score?",
    answer:
      'For any grievances related to your CIBIL score, please email support@lazypay.in using the subject line "CIBIL Score Grievance." If you do not receive a response within 48 hours of raising your request, you can escalate the matter to our grievance officer, who will respond within 24 hours of the escalation.',
  },
  {
    id: "what-is-score",
    question: "What is a CIBIL score?",
    answer:
      "A 3-digit number from CIBIL reflecting your creditworthiness, ranging from 300 to 900. A higher score signifies stronger creditworthiness.",
  },
  {
    id: "old-score",
    question: "I am seeing an old score, how can I get my latest credit score?",
    answer:
      "You can fetch your latest credit score every 30 days. Please note that these score fetches are soft inquiries and hence do not impact your credit score in any manner.",
  },
  {
    id: "benefits",
    question: "What are the benefits of a good CIBIL score?",
    answer:
      "A high CIBIL score can help with faster loan approvals and better interest rates from banks.",
  },
  {
    id: "credit-bureaus",
    question: "What are credit bureaus?",
    answer:
      "Credit bureaus are RBI-approved agencies that collect credit information to assign scores. The four main bureaus are TransUnion CIBIL, CRIF, Equifax, and Experian.",
  },
  {
    id: "more-than-one",
    question: "Is there more than one score for an individual?",
    answer:
      "Yes, each credit bureau (TransUnion CIBIL, CRIF, Equifax, Experian) generates their own score based on their data.",
  },
  {
    id: "different-on-lazypay",
    question: "Why is my credit score different on LazyPay?",
    answer:
      "Sometimes it takes up to 4 months before data of your latest credit card activity is accounted for by the credit bureau. Accordingly, your credit activity can be recorded differently by bureaus at different points in time, leading to a variation in your credit score. Also, different bureaus have slightly different methodologies for calculating credit scores, which lead to variations.",
  },
  {
    id: "score-down",
    question: "Why did my score go down?",
    answer:
      "There are several factors which can drag your credit score down — most importantly, missing any loan EMI or credit card payment due dates. If you utilize too much of your credit limit, that can also hamper your score. Applying for many loans or credit cards in a short period of time can temporarily lower it too.",
  },
  {
    id: "improve-score",
    question: "How can I improve my score?",
    answer:
      "The best way to improve your score is to keep making timely payments on all your loans and credit cards without any delay. If you frequently use too much of your credit limit, consider getting it raised or applying for more credit cards. Keep your old credit cards active, as the overall age of your credit history improves your score. Having a good credit mix between loans and credit cards also helps.",
  },
  {
    id: "checking-decrease",
    question: "Will checking my score decrease it?",
    answer: "No, checking your score has no impact on your score.",
  },
  {
    id: "inaccuracy",
    question:
      "My credit score or credit report data has an inaccuracy, how can I get it corrected?",
    answer:
      "LazyPay recovers your report directly from the bureau and is not involved in evaluating your credit score. If you see any errors in your credit report, it's recommended you notify the credit bureau immediately. You can easily do so by sending the credit bureau an email through the 'report an error' screen at the bottom of the credit report section.",
  },
  {
    id: "different-apps",
    question: "Why is my score different on different apps?",
    answer:
      "Different apps use different bureaus or refresh times, causing variations in your score.",
  },
  {
    id: "why-high-score",
    question: "Why do I need to maintain a high credit score?",
    answer:
      "Your credit score is an important factor when you apply for any type of credit — credit cards, loans, or mortgages. A high credit score makes approval of your credit requests easier and helps you get lower interest rates compared to the market. Additionally, you can more easily raise your credit card limit and get higher loan amounts granted.",
  },
  {
    id: "payments-affect",
    question: "Do my payments affect my credit score?",
    answer:
      "Yes, making on-time payments is a factor that influences your credit score. On-time payments (made before the due date) positively affect your score, while delayed payments (made up to 89 days after the due date) and overdue payments (made beyond the 89-day buffer) negatively affect it.",
  },
  {
    id: "frequently-checking",
    question: "Would frequently checking my credit score lower it?",
    answer:
      "No. Checking your own credit score is a soft inquiry and does not affect it, no matter how often you check.",
  },
];

export default function Faq() {
  return (
    <div className="flex flex-1 flex-col bg-background-secondary">
      <NavBar title="FAQ" border={true} />

      <div className="flex flex-col gap-2 px-4 pt-6 pb-4">
        <h2 className="text-[16px] leading-6 font-semibold text-content-secondary">
          Got questions?
        </h2>

        <Accordion.Root className="flex flex-col overflow-hidden rounded-2xl border border-border-primary bg-background-primary">
          {FAQS.map(({ id, question, answer }) => (
            <Accordion.Item
              key={id}
              className="border-b border-border-primary last:border-b-0"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left outline-none">
                  <span className="text-[14px] leading-5 text-content-primary">
                    {question}
                  </span>
                  <span className="flex shrink-0 items-center justify-center rounded-full bg-background-secondary p-1">
                    <IconChevronDown
                      size={20}
                      stroke={2}
                      className="text-content-primary transition-transform duration-200 group-data-[panel-open]:rotate-180"
                    />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                <p className="px-4 pb-4 text-[14px] leading-5 text-content-inactive">
                  {answer}
                </p>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}
