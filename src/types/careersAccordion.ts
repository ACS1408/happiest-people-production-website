export interface CareersAccordionSection {
  title: string;
  type: string;
  richText: React.ReactNode;
}

export interface CareersAccordionSettings {
  sections: CareersAccordionSection[];
  arrowIcon?: React.ReactNode;
  applyLabel?: string;
}
