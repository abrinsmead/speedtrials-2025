import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossary - Georgia Drinking Water',
  description: 'Definitions of water quality terms and regulations',
};

const glossaryTerms = [
  {
    term: 'Community Water System (CWS)',
    definition:
      'A public water system that supplies water to the same population year-round. These serve most people in the United States and include cities, towns, and subdivisions.',
  },
  {
    term: 'Contaminant',
    definition:
      'Any physical, chemical, biological, or radiological substance or matter in water that may pose a health risk.',
  },
  {
    term: 'EPA',
    definition:
      'Environmental Protection Agency - The federal agency responsible for protecting human health and the environment, including drinking water safety.',
  },
  {
    term: 'EPD',
    definition:
      "Environmental Protection Division - Georgia's state agency responsible for protecting air, land, and water resources.",
  },
  {
    term: 'Health-Based Violation',
    definition:
      'A violation that has the potential to have serious adverse effects on human health. These are the most serious type of violations.',
  },
  {
    term: 'Lead and Copper Rule (LCR)',
    definition:
      'A regulation to control lead and copper in drinking water. Systems must monitor drinking water at customer taps.',
  },
  {
    term: 'Maximum Contaminant Level (MCL)',
    definition:
      'The highest level of a contaminant that is allowed in drinking water. MCLs are enforceable standards.',
  },
  {
    term: 'Maximum Contaminant Level Goal (MCLG)',
    definition:
      'The level of a contaminant in drinking water below which there is no known or expected risk to health. MCLGs are non-enforceable public health goals.',
  },
  {
    term: 'Monitoring Violation',
    definition:
      'Failure to conduct regular monitoring of drinking water quality or to submit monitoring results in a timely fashion.',
  },
  {
    term: 'Non-Transient Non-Community Water System (NTNCWS)',
    definition:
      'A public water system that regularly supplies water to at least 25 of the same people at least six months per year. Examples include schools, factories, and office buildings.',
  },
  {
    term: 'Primacy Agency',
    definition:
      'A state that has been granted primary enforcement authority for the drinking water program by EPA. Georgia has primacy.',
  },
  {
    term: 'Public Notification',
    definition:
      'Requirements for water systems to alert consumers if there is a serious problem with their drinking water.',
  },
  {
    term: 'Public Water System (PWS)',
    definition:
      'A system that provides water for human consumption to at least 25 people or 15 service connections for at least 60 days per year.',
  },
  {
    term: 'PWSID',
    definition:
      'Public Water System Identification number - A unique identifier for each water system, starting with a 2-letter state code (GA for Georgia) followed by 7 digits.',
  },
  {
    term: 'Reporting Violation',
    definition:
      'Failure to report monitoring results or other required information to the state or EPA in a timely manner.',
  },
  {
    term: 'Sanitary Survey',
    definition:
      'An on-site review of the water source, facilities, equipment, operation, and maintenance of a public water system.',
  },
  {
    term: 'SDWA',
    definition:
      'Safe Drinking Water Act - The federal law that protects public drinking water supplies throughout the nation.',
  },
  {
    term: 'SDWIS',
    definition:
      "Safe Drinking Water Information System - EPA's national database that contains information about public water systems and their violations.",
  },
  {
    term: 'Service Connection',
    definition:
      'A pipe that connects the water main to a building or property to provide water service.',
  },
  {
    term: 'Site Visit',
    definition:
      'A physical inspection of water system facilities by regulators to evaluate compliance and system operations.',
  },
  {
    term: 'Surface Water',
    definition: 'Water from sources open to the atmosphere, such as rivers, lakes, and reservoirs.',
  },
  {
    term: 'Transient Non-Community Water System (TNCWS)',
    definition:
      'A public water system that provides water in places where people do not remain for long periods, such as gas stations and campgrounds.',
  },
  {
    term: 'Treatment Technique (TT)',
    definition:
      'A required process intended to reduce the level of a contaminant in drinking water when there is no reliable method to measure the contaminant at very low levels.',
  },
  {
    term: 'Violation',
    definition:
      'Failure to comply with any national primary drinking water regulation or variance/exemption schedule.',
  },
  {
    term: 'Groundwater',
    definition:
      'Water found underground in aquifers, which is pumped to the surface for use. Often requires less treatment than surface water.',
  },
  {
    term: 'Action Level',
    definition:
      'The concentration of a contaminant which, if exceeded, triggers treatment or other requirements that a water system must follow.',
  },
  {
    term: 'Compliance Period',
    definition:
      'A calendar period during which compliance with drinking water regulations is determined.',
  },
  {
    term: 'Consumer Confidence Report (CCR)',
    definition:
      'An annual water quality report that community water systems must deliver to their customers.',
  },
  {
    term: 'Enforcement Action',
    definition:
      'Any formal or informal action taken by EPA or a state to address a violation and return a system to compliance.',
  },
];

export default function GlossaryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Water Quality Glossary</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Understanding water quality reports and regulations can be challenging. This glossary
        explains common terms you may encounter when reviewing your water system&apos;s data.
      </p>

      <div className="space-y-6">
        {glossaryTerms
          .sort((a, b) => a.term.localeCompare(b.term))
          .map((item) => (
            <div key={item.term} className="border-b pb-4">
              <h2 className="mb-2 text-xl font-semibold">{item.term}</h2>
              <p className="text-muted-foreground">{item.definition}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
