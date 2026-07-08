"use client";

import { Accordion } from "@base-ui/react/accordion";
import { IconChevronDown } from "@tabler/icons-react";
import NavBar from "../components/NavBar";

const FAQS = [
  {
    id: "what-is-score",
    question: "What is a Credit score?",
    answer:
      "A 3-digit number from Credit bureau, ranging from 300 to 900 that reflects your creditworthiness. A higher score signifies stronger creditworthiness.",
  },
  {
    id: "benefits",
    question: "What are the benefits of exceptional/high credit score?",
    answer:
      "A high credit score can help with the easy approval of your credit requests(credit cards, Loans, or mortgages) and lower interest rates.",
  },
  {
    id: "different-on-lazypay",
    question: "Why is my credit score different on LazyPay App?",
    answer:
      "Sometimes it takes up to 4 months before data of your latest credit card activity is accounted for by the credit bureau. Accordingly, your credit activity can be recorded differently by bureaus at different points in time, leading to a variation in your credit score. Also, different bureaus have slightly different methodologies for calculating credit scores, which lead to variations.",
  },
  {
    id: "revoke-consent",
    question: "How do I revoke my CIBIL consent?",
    answer:
      'To revoke your consent for accessing your credit report from CIBIL, please email wecare@payufin.com using the subject line "Revoke My CIBIL Consent." If you do not receive a response within 48 hours of raising your request, you can escalate the matter to our grievance officer, who will respond within 24 hours of the escalation.',
  },
  {
    id: "grievances",
    question: "How can I get my grievances addressed for my CIBIL score?",
    answer:
      'For any grievances related to your CIBIL score, please email wecare@payufin.com using the subject line "CIBIL Score Grievance." If you do not receive a response within 48 hours of raising your request, you can escalate the matter to our grievance officer, who will respond within 24 hours of the escalation.',
  },
  {
    id: "old-score",
    question: "I am seeing an old score, how can I get my latest credit score?",
    answer:
      "You can fetch your latest credit score every 30 days. Please note that these score fetches are soft inquiries and hence do not impact your credit score in any manner.",
  },
  {
    id: "inaccuracy",
    question:
      "My credit score or credit report data has an inaccuracy, how can I get it corrected?",
    answer:
      "PayUFin recovers your report directly from the bureau and is not involved in evaluating your credit score. If you see any errors in your credit report, it's recommended you notify the credit bureau immediately. You can easily do so by sending the credit bureau an email through the 'report an error' screen at the bottom of the credit report section.",
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
