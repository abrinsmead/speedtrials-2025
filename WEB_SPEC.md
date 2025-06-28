# Drinking Water Viewer (DWV) - Technical Specification

## Overview
The Drinking Water Viewer (DWV) is a web-based application designed to provide public access to drinking water quality data, enable water system operators to manage their systems, support laboratory QA/QC processes, and provide mobile access for state/EPA staff.

## MoSCoW Requirements

### MUST HAVE

#### Authentication & User Management
- **Public Access**: Unauthenticated public access for viewing water system data
- **User Account Management**: 
  - Create new user accounts
  - Remove user accounts
  - Lock/unlock user accounts
- **Role-Based Access Control (RBAC)**:
  - Function-based user privileges
  - View-only permissions
  - Update/edit permissions
- **User Types**: Support for 2 agency users + 1 admin user minimum

#### Core Data Modules
The application must display the following data types:
1. **Water System Inventory** - Facilities and sampling points
2. **Samples** - Water quality sample data
3. **Violations** - Compliance violations
4. **Enforcements** - Enforcement actions
5. **Schedules & Activities** - System activities and schedules
6. **Site Visits** - Inspection and visit records
7. **Deficiencies** - System deficiencies

#### Search & View Capabilities
- **Single System View**: View all data for a chosen water system
- **Cross-System Search**: Search for specific data across multiple water systems
- **Public Access**: Both capabilities available to public users without authentication

#### User-Specific Functions
- **Operator Dashboard**: Water system operators can view information to manage their systems
- **Laboratory Module**: 
  - QA/QC capabilities for submitted data
  - Data download for electronic sample submissions
- **Mobile Access**: Responsive design for state/EPA staff field use

#### Technical Requirements
- **Platform**: Web-based application
- **Hosting**: Cloud hosting on Azure, AWS, or Salesforce
- **Integration**: SDWIS integration via modern web services/APIs
- **Data Access**: 
  - Display current SDWIS water system data
  - Real-time data access
  - Historical data access
- **Compliance**: Support SDWA regulatory compliance

### SHOULD HAVE
- **User Experience**: User-friendly, intuitive interface suitable for general public use
- **Future-Proofing**: Compatibility with SDWIS Modernization efforts

### COULD HAVE
- No additional requirements identified

### WON'T HAVE (Future Enhancement)
- **RECAP Features**:
  - Dashboard with to-do lists
  - Advanced reporting features
  - Automated compliance letters/reminders
  - Other RECAP functionality (explicitly stated as "not an immediate need")

## Technical Architecture

### Frontend
- [x] Next.js 15 with App Router
- [x] TypeScript for type safety
- [x] Tailwind CSS for styling
- [ ] Responsive design for mobile access

### Backend (TBD)
- [ ] RESTful API design
- [ ] SDWIS integration layer
- [ ] Authentication/authorization service

### Data Storage (TBD)
- [ ] Cloud-based database solution
- [ ] Support for real-time and historical data

### Deployment
- [ ] Cloud hosting (Azure/AWS/Salesforce)
- [ ] CI/CD pipeline
- [ ] Environment management (dev/staging/production)

## User Roles

1. **Public User** (Unauthenticated)
   - View water system data
   - Search across systems
   - Read-only access

2. **Operator**
   - All public user capabilities
   - Access operator dashboard
   - Manage their water system data

3. **Laboratory User**
   - QA/QC functions
   - Data submission capabilities
   - Download sample data

4. **Agency User**
   - Full data access
   - Mobile-optimized views
   - Field access capabilities

5. **Admin User**
   - User management
   - System configuration
   - Full system access

## Compliance & Security
- SDWA regulatory compliance
- Data privacy protection
- Secure authentication for non-public users
- Audit logging for data changes
- Regular security assessments

## Success Criteria
- [ ] Public can easily find and view their water system data
- [ ] Operators can efficiently manage their systems
- [ ] Labs can perform QA/QC and submit data electronically
- [ ] State/EPA staff have reliable mobile access
- [ ] System integrates seamlessly with SDWIS
- [ ] Platform is scalable and maintainable

## Implementation Checklist

### Phase 1: Foundation
- [x] Initialize Next.js project with TypeScript and Tailwind
- [ ] Set up project structure and coding standards
- [ ] Configure ESLint and Prettier
- [ ] Set up Git workflow and branch protection
- [ ] Create component library foundation

### Phase 2: Authentication & User Management
- [ ] Implement authentication service
- [ ] Create user management UI
- [ ] Set up RBAC system
- [ ] Build login/logout flows
- [ ] Add user profile management

### Phase 3: Core Data Modules
- [ ] Water System Inventory module
- [ ] Samples data module
- [ ] Violations tracking module
- [ ] Enforcements module
- [ ] Schedules & Activities module
- [ ] Site Visits module
- [ ] Deficiencies module

### Phase 4: Search & Public Access
- [ ] Public landing page
- [ ] Water system search functionality
- [ ] Single system data viewer
- [ ] Cross-system search interface
- [ ] Data export capabilities

### Phase 5: User-Specific Features
- [ ] Operator dashboard
- [ ] Laboratory QA/QC interface
- [ ] Mobile-responsive design
- [ ] Field access optimizations

### Phase 6: Integration & Deployment
- [ ] SDWIS API integration
- [ ] Cloud hosting setup
- [ ] CI/CD pipeline configuration
- [ ] Security audit
- [ ] Performance optimization
- [ ] User acceptance testing
- [ ] Production deployment

## Appendix A: Georgia Drinking Water Viewer RFI (Full Text)

### State of Georgia
#### State Entity: Department of Natural Resources - EPD
#### Electronic Request for Information ("eRFI")
##### Event Name: Drinking Water Viewer / RECAP Report
##### eRFI (Event) Number: 46200-DNR0000804

### 1. Introduction

#### 1.1. Purpose of Solicitation
This electronic Request for Information ("eRFI") is being issued to solicit information from interested suppliers with respect to Drinking Water Viewer / RECAP Report for the Department of Natural Resources – Environmental Protection Division (EPD) (hereinafter, "the State Entity") as further described in this eRFI. The State Entity will use the information generated by this eRFI in conjunction with other information available to the State Entity to determine the solution that it is in the best interests of the State Entity to fulfill this need.

#### 1.2. Overview of the eRFI Process
The objective of the eRFI is to gather information to assist the State Entity in its consideration of available resources/methods to fulfill the need/goal identified above. The eRFI method is not a competitive solicitation method and, as a result, does not satisfy the requirement for competitive bidding. The eRFI method is no more than an information gathering tool and such information gathered may or may not be used by the State Entity to develop a competitive solicitation. Suppliers are not required to respond to an eRFI and a supplier's failure to respond to an eRFI will not prohibit the supplier's participation in any competitive solicitation that may result from the eRFI. However, suppliers are strongly encouraged to respond to eRFIs as this is a great way to ensure the State Entity is aware of the suppliers' available goods and services.

#### 1.3. Schedule of Events
The schedule of events set out herein represents the State Entity's best estimate of the schedule that will be followed. However, delays to the procurement process may occur which may necessitate adjustments to the proposed schedule. If a component of this schedule, such as the close date, is delayed, the rest of the schedule may be shifted as appropriate. Any changes to the dates up to the closing date of the eRFI will be publicly posted prior to the closing date of this eRFI. After the close of the eRFI, the State Entity reserves the right to adjust the remainder of the proposed dates on an as needed basis with or without notice.

| Description | Date | Time |
|------------|------|------|
| Release of eRFI | As Published on the Georgia Procurement Registry ("GPR") | N/A |
| Written Questions | 06/27/2025 | 5:00 p.m. ET |
| Responses to Written Questions | 07/02/2025 | 5:00 p.m. ET |
| Deadline for Submitting Responses | As Published on the GPR | See GPR |

#### 1.4. Official Issuing Officer (Buyer)
Rhonda Henslee
Rhonda.Henslee@dnr.ga.gov

#### 1.5. Definition of Terms
Please review the following terms:
Supplier(s) – companies desiring to do business with the State of Georgia.
State Entity – the governmental entity identified in Section 1.1 "Purpose of Solicitation" of this eRFI.
COTS – Commercial-off-the-shelf
DWP – Drinking Water Program
DWV – Drinking Water Viewer
EPD – Environmental Protection Division
EPD-IT – Environmental Protection Division Information Technology
PWS – Public Water Supply
QA/QC – Quality Analyze/Quality Control
RECAP – Report Evaluation Compliance and Processing
RFI – Request for Information
SDWA – Safe Drinking Water
SDWIS – Safe Drinking Water Information System

Any special terms or words which are not identified in this State Entity eRFI Document may be identified separately in one or more attachments to the eRFI. Please download, save and carefully review all documents in accordance with the instructions provided in Section 2 "Instructions to Suppliers" of this eRFI.

### 2. Instructions to Suppliers

By submitting a response to the eRFI, the supplier is acknowledging that the supplier:
1. Has read the information and instructions,
2. Agrees to comply with the information and instructions contained herein.

#### 2.1. General Information and Instructions

##### 2.1.1. Team Georgia Marketplace™ Registration System
The Department of Administrative Services ("DOAS") requires all companies and/or individuals interested in conducting business with the State of Georgia to register in the State's web-based registration system, through Team Georgia Marketplace™. Registration is free and enables the registering company to gain access to certain information, services and/or materials maintained in Team Georgia Marketplace™ at no charge to the registering company. All registering companies must agree to be bound by the applicable terms and conditions governing the supplier's use of Team Georgia Marketplace™. In the event DOAS elects to offer certain optional or premium services to registered companies on a fee basis, the registered company will be given the opportunity to either accept or reject the service before incurring any costs and still maintain its registration. Companies may register at https://fscm.teamworks.georgia.gov/psc/supp/SUPPLIER/ERP/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL?&

##### 2.1.2. Submitting Questions
All questions concerning this eRFI must be submitted in writing via email to the Issuing Officer identified in Section 1.4 "Issuing Officer" of this eRFI. Do not use the comments section within the sourcing tool to submit questions to the issuing officer.

##### 2.1.3. State's Right to Amend and/or Cancel the eRFI
The State Entity reserves the right to amend this eRFI. Any revisions must be made in writing prior to the eRFI closing date and time. By submitting a response, the supplier shall be deemed to have accepted all terms and agreed to all requirements of the eRFI (including any revisions/additions made in writing prior to the close of the eRFI whether or not such revision occurred prior to the time the supplier submitted its response) unless expressly stated otherwise in the supplier's response. THEREFORE, EACH SUPPLIER IS INDIVIDUALLY RESPONSIBLE FOR REVIEWING THE REVISED eRFI AND MAKING ANY NECESSARY OR APPROPRIATE CHANGES AND/OR ADDITIONS TO THE SUPPLIER'S RESPONSE PRIOR TO THE CLOSE OF THE eRFI. Suppliers are encouraged to frequently check the eRFI for additional information. Finally, the State Entity reserves the right to cancel this eRFI at any time.

##### 2.1.4. Costs for Preparing Response
Each response should be prepared simply and economically, avoiding the use of elaborate promotional materials beyond those sufficient to provide a complete presentation. The cost for developing the response and participating in this eRFI process is the sole responsibility of the supplier. The State will not provide reimbursement for such costs.

##### 2.1.5. ADA Guidelines
The State of Georgia adheres to the guidelines set forth in the Americans with Disabilities Act. Suppliers should contact the Issuing Officer at least one day in advance if they require special arrangements when attending the Informational Conference (if any). The Georgia Relay Center at 1-800-255-0056 (TDD Only) or 1-800-255-0135 (Voice) will relay messages, in strict confidence, for the speech and hearing impaired.

##### 2.1.6. Public Access to Procurement Records
Solicitation opportunities will be publicly advertised as required by law and the provisions of the Georgia Procurement Manual. The State Entity is allowed to assess a reasonable charge to defray the cost of reproducing documents. A state employee should be present during the time of onsite inspection of documents. PLEASE NOTE: Even though information (financial or other information) submitted by a supplier may be marked as "confidential", "proprietary", etc., the State will make its own determination regarding what information may or may not be withheld from disclosure.

##### 2.1.7. Registered Lobbyists
By submitting a response to this eRFI, the supplier hereby certifies that the supplier and its lobbyists are in compliance with the Lobbyist Registration Requirements in accordance with the Georgia Procurement Manual.

#### 2.2. Submittal Instructions
Submittal Instructions for Team Georgia Marketplace™

Listed below are key action items related to this eRFI. The Schedule of Events in Section 1.3 identifies the dates and time for these key action items. This portion of the eRFI provides high-level instructions regarding the process for reviewing the eRFI and preparing and submitting a response to the eRFI. Suppliers are required to access, print and utilize the training materials identified in Section 2.2.1 of this eRFI to ensure the supplier successfully submits a response to this eRFI.

##### 2.2.1. eRFI Released – Team Georgia Marketplace™
The release of the eRFI is formally communicated through the posting of this eRFI as an event in Team Georgia Marketplace™ and by a public announcement posted to the Georgia Procurement Registry, which is accessible online as follows: http://ssl.doas.state.ga.us/PRSapp/PR_index.jsp

This eRFI is being conducted through Team Georgia Marketplace™, an online, electronic tool, which allows an individual to register, logon, select answers and type text in response to questions, and upload any necessary documents. Team Georgia Marketplace™ permits an individual to build and save a response over time until the registered user is ready to submit the completed response. Each supplier MUST carefully review the instructions and training information from the following link for a comprehensive overview of the functionality of Team Georgia Marketplace™:
http://doas.ga.gov/state-purchasing/purchasing-education-and-training/supplier-training

##### 2.2.2. eRFI Review
The eRFI (or "Event") consists of the following: this document, entitled "The State Entity eRFI Document", any and all information included in the Event, as posted online on Team Georgia Marketplace™, including questions and instructions, and any and all documents provided by the State Entity as attachments to the Event or links contained within the Event or its attached documents.

Please carefully review all information contained in the Event, including all documents available as attachments or available through links. Any difficulty accessing the Event or opening provided links or documents should be reported immediately to the Issuing Officer (See Section 1.4) and/or the Help Desk (Section 2.2.8). Attached documents may be found as follows:

1. First, the State Entity will provide documents at the "header" level of the Event. Please select "View/Add General Comments & Attachments", which appears at the top of the screen of the Event under the "Event Details" Section. Next, by selecting "View Event Attachments", the supplier may open and save all of the available documents. In this location, the supplier is most likely to find this document as well as any worksheets. Please thoroughly review all provided Event Attachments.

2. Second, the State Entity may also provide documents in the section of the Event entitled "eRFI Questions". To the right of each question appearing under the eRFI Questions section, the Event contains an icon (appears as a bubble with text). By selecting this icon, the supplier will navigate to a new page of the Event. On this new page the supplier can locate attached documents.

Please thoroughly review all provided attachments. For additional information regarding the use of Team Georgia Marketplace™, please utilize the online resources provided in Section 2.2.1 of this eRFI.

##### 2.2.3. Preparing a Response
As noted earlier, Team Georgia Marketplace™ allows the supplier to answer questions by entering text and numeric responses. In addition, as noted in Section 2.2.4 "Uploading Forms", the supplier may also provide information by uploading electronic files. When preparing a response, the supplier must consider the following instructions:

1. The supplier must ensure its response is accurate and readily understandable.
2. The supplier must label any and all uploaded files using the corresponding section numbers of the eRFI or any other logical name so that the State Entity can easily organize and navigate the supplier's response.
3. The supplier must use commonly accepted software programs to create electronic files. The State Entity has the capability of viewing documents submitted in the following format: Microsoft Word or WordPad, Microsoft Excel, portable document format file, and plain text files with the file extension noted in parentheses (.txt). Unless the eRFI specifically requests the use of another type of software or file format than those listed above, please contact the Issuing Officer prior to utilizing another type of software and/or file format.
4. The supplier must save its response until the supplier is ready to submit its bid. Select the "Save for Later" button at the top of the page under "Event Details" of the Event.

##### 2.2.4. Uploading Forms
Once the supplier is ready to upload electronic files (completed forms or worksheets, product sheets, etc.), please following the directions within the eRFI to upload these documents in the proper location. There are two places to upload completed documents:

1. First, the "View/Add General Comments & Attachments" link contains a place for the supplier to upload all of the documents and worksheets which were provided by the State Entity under the "View Event Attachments" link. Once the supplier has completed the Event Attachments, the supplier can then select "Add New Attachments" to upload the completed documents. The supplier can upload as many documents as necessary in this section of the Event.

2. Second, the supplier can also upload documents by selecting the comment bubble icon, which appears to the right of each eRFI question.

##### 2.2.5. Reviewing the Response Prior to Submission
During the time period allowed for preparing the response, neither DOAS nor the State Entity can view what information or documents are being added by the registered user. In other words, the State Entity cannot know whether the supplier's response is correct or complete until after the eRFI has closed. Therefore, each supplier is responsible for ensuring all questions have been answered appropriately and that all necessary documents have been uploaded.

##### 2.2.6. Submitting the Completed Response/Bid
Once the completed response has been reviewed by the supplier, click the "Submit Bid" button at the top of the page under the "Event Details" section of the Event. Please note that submission is not instantaneous; therefore, each supplier must allow ample time for its response to be submitted prior to the deadline.

##### 2.2.7. Reviewing, Revising or Canceling a Submitted Response
After the response has been submitted, the supplier may view and/or revise its response by logging into Team Georgia Marketplace™ and selecting the eRFI event number and the "View/Edit" feature for the supplier's previous response. Please take note of the following:

1. REVIEW ONLY. In the event the supplier only wishes to view a submitted response, the supplier may select "View/Edit". Once the supplier has finished viewing the response, the supplier may simply exit the screen. DO NOT SELECT "Save for Later." Team Georgia Marketplace™ recognizes any response placed in the "Save for Later" status as a work in progress and withdraws the originally submitted bid. As a result, unless the supplier selects "Submit" prior to the closing date and time, no response will be transmitted to the State Entity.

2. REVIEW AND REVISE. In the event the supplier desires to revise a previously submitted response, the supplier may select "View/Edit" and then revise the response. If the revisions cannot be completed in a single work session, the supplier should save its progress by selecting "Save for Later." Once revisions are complete, the supplier MUST select "Submit" to submit its corrected response. Please permit adequate time to revise and then resubmit the response. Please note submission is not instantaneous and may be affected by several events, such as the supplier temporarily losing a connection to the Internet. PLEASE USE CAUTION IN DECIDING WHETHER OR NOT TO MAKE REVISIONS. The State will assume no responsibility for a supplier's inability to correct errors or otherwise make revisions to the submitted response prior to the eRFI end date and time.

3. WITHDRAW/CANCEL. In the event the supplier desires to revise a previously submitted response, the supplier may select "View/Edit" and then select "Save for Later". Team Georgia Marketplace recognizes any response placed in the "Save for Later" status as a work in progress and withdraws the originally submitted bid. As a result, unless the supplier selects "Submit" prior to the closing date and time, no response will be transmitted to the State Entity.

##### 2.2.8. Help Desk Support
For technical questions related to the use of Team Georgia Marketplace™, suppliers have access to phone support through the DOAS Customer Service Help Desk at 404-657-6000, Monday through Friday 8:00 AM to 5:00 PM excluding State Holidays or any other day state offices are closed such as furlough days or closings in response to inclement weather. Suppliers can also email questions to: ProcurementHelp@doas.ga.gov.

### 3. Requested Information

#### Agency Overview
The Environmental Protection Division (EPD) of the Georgia Department of Natural Resources is a state agency charged with protecting Georgia's air, land, and water resources through the authority of state and federal environmental statutes. These laws regulate public and private facilities in the areas of air quality, water quality, hazardous waste, water supply, solid waste, surface mining, underground storage tanks, and others. EPD issues and enforces all state permits in these areas and has full delegation for federal environmental permits except Section 404 (wetland) permits.

#### The Opportunity
In the early 1990s, EPA set out to provide important drinking water agencies with an information system that would not only report accurate data to the federal system on a timely basis but would also support the rule implementation activities of primacy agencies so that these agencies would not have to develop an information system on their own. That system, known as the Safe Drinking Water Information System (SDWIS/STATE), needed to be efficient enough to enable compliance determination for a host of growing EPA regulations, and it needed to gain acceptance by addressing the specific needs of a large and varied base of primacy organizations.

Drinking Water Program (DWP) is looking to implement a new solution to, process, and analyze water-related data from the existing SDWIS to provide comprehensive insights into availability, quality, consumption, and distribution. By integrating with SDWIS, this solution aims to improve decision-making, optimize resources management, and enhance transparency in water-related operations. The Drinking Water Program is taking this opportunity to provide live water system information at your fingertips. Drinking Water Viewer (DWV) will view current SDWIS water system data including sample results, compliance data, and inventory.

#### Purpose of Request for Information
The purpose of this Request for Information (RFI) is to explore potential DWV Commercial-Off-The-Shelf (COTS) solutions that will integrate with SDWIS. This integration aims to enhance access to real-time and historical water quality data, improve decision-making capabilities, and ensure compliance with regulatory standards. The drinking water viewer will enable the program and the public to visualize and analyze water quality information efficiently.

#### RECAP
Report, Evaluation, Compliance, and Processing (RECAP) is a road map item and not an immediate need.

#### Benefits
• RECAP has more advanced functionality than Microsoft Access Databases.
• RECAP's four add-on features use web services to extract information from databases and present it in useful formats.
• Quickly generate reports and metrics to assist agency staff with compliance determination and keeping water systems in compliance with the Safe Drinking Water Act (SDWA) regulations.
• RECAP can be integrated with other applications to display information.

#### Reports
• Generates custom reports, outputs, and letters to help important agencies quickly review water system data and compliance information.
• Letters, reminders, and reports can be sent to water systems to help them remain in compliance with SDWA regulations.

#### Dashboard
• Tracks to-do list of tasks that can be marked as completed so managers can see if staff are addressing issues.
• Ensure things don't fall through the cracks and help staff keep up with routine compliance activities.
• Help managers, compliance and enforcement staff focus on using grids, metrics, and graphs on an uncluttered dashboard.

#### System Requirements
The solutions will be reviewed and evaluated based on the following key features:

##### General System Capabilities
Describe how well the product/solution serves the EPD Drinking Water Program's needs:
1. User Management
2. Operation Capacity
3. Compliance with Regulatory Requirements and Industry Standards

##### Required Functionality
Describe how well the product/solution serves the EPD Drinking Water Program's needs:
• The public can view data for a chosen water system or search for specific data across many water systems.
• Operators can view information to help them better manage their water system.
• Laboratories can Quality Analyze/Quality Control (QA/QC) data submitted to the important agency and download data needed for electronic sample submissions.
• State and EPA staff can pull up live, detailed information from their phone for meetings, conferences, or on-site visits.

##### Accessibility
DWV is a user-friendly, intuitive application designed to enable any user to find drinking water data for their state, including:
• Water System Inventory (e.g., facilities and sampling points)
• Samples
• Violations
• Enforcements
• Schedules & Activities
• Site Visits
• Deficiencies

##### Technology Requirements
Describe how well the product/solution serves the overall technological needs:
1. Delivery Method
   • Web-based/Hosting (Azure, Amazon Web Services (AWS), or Salesforce)
2. Maintenance and Support

##### User Management
This is the core function that controls system access and permissions and covers what users are authorized to do.
• The ability to create new user accounts and remove and/or lock user accounts.
• Create user privileges based on function.
• Control which users have the right to view only / update specified data.

##### Operation Capacity
• Two agency users.
• One administration user.
• External users will not need accounts since it is free for public users.

##### Data Integration
The new solution uses modern technologies (e.g., web services/APIs) that will be compatible with SDWIS Modernization.

#### Supplier Background
Company History and Affiliations:
Office Locations:
Statement of Core Business Competencies:

#### Capabilities And Experience
When detailing experience, document experience on at least three and no more than five projects completed no earlier than 2020.
• Capabilities:
• Experience:
• Why you'd be a good fit:

#### Software Pricing Model
• Cost Per License

Do you subcontract work to 3rd parties? If yes, explain:

#### Additional Information
Detail any further information believed to be beneficial in support of this Request for Information review effort.

### 4. Additional Information
The State Entity may, at its discretion, ask one or more suppliers to provide additional information and/or meet with the State Entity to further discuss the supplier's information.

### 5. List of eRFI Attachments
The following documents make up this eRFI. Please see Section 2.2.2 "eRFI Review" for instructions about how to access the following documents. Any difficulty locating or accessing the following documents should be immediately reported to the Issuing Officer.

A. State Entity eRFI (this document)
B. Special Term Definitions from Section 1.5 "Definition of Terms" of this eRFI – NOT Applicable

---
Revised 10/12/18  
SPD-PS013  
Page 1 of 8 through Page 8 of 8

## Appendix B: Key Drinking Water Regulatory Concepts and Systems

### Executive Summary

This supplemental report provides background information on critical drinking water regulatory frameworks, systems, and terminology that are essential context for the Drinking Water Viewer (DWV) Request for Information. Understanding these concepts is crucial for developing a solution that properly integrates with existing regulatory infrastructure and serves the needs of various stakeholders in the drinking water ecosystem.

### 1. Safe Drinking Water Information System (SDWIS)

#### Overview
The Safe Drinking Water Information System (SDWIS) contains information about public water systems and their violations of EPA's drinking water regulations. SDWIS serves as the central repository for tracking compliance with the Safe Drinking Water Act (SDWA).

#### Key Components
- **SDWIS/FED**: The federal version (SDWIS/FED) stores the information the U.S. Environmental Protection Agency (EPA) needs to monitor approximately 156,000 public water systems.
- **SDWIS/STATE**: The state version (SDWIS/STATE) is a database designed to help states run their drinking water programs.

#### Data Elements Tracked
The following types of data are included for each water system: basic information (such as name, location, type of system, number of people served); violation information (such as compliance with monitoring and treatment schedules, etc.); enforcement information (such as actions taken to return system to compliance); and sampling information (for unregulated and regulated contaminants).

#### Reporting Requirements
The Safe Drinking Water Act requires states to report drinking water information periodically to EPA. This creates a flow of information from:
1. Public Water Systems → Primacy Agencies (States/Tribes)
2. Primacy Agencies → EPA SDWIS/FED

### 2. Primacy Agencies and State Programs

#### Definition and Authority
EPA delegates primary enforcement responsibility (also called primacy) for public water systems to states and Indian Tribes if they meet certain requirements. Under SDWA, all territories, most states, and the Navajo Nation have been approved for "primacy," meaning the authority to implement and enforce SDWA within their jurisdictions.

#### Requirements for Primacy
States must demonstrate they can:
- Have regulations for contaminants regulated under the National Primary Drinking Water Regulations (NPDWRs) that are no less stringent than the regulations promulgated by EPA
- Have adopted and be implementing procedures for the enforcement of state regulations
- Maintain an inventory of public water systems in the state
- Have a program to conduct sanitary surveys of the systems in the state
- Have a program to certify laboratories that will analyze water samples required by the regulations

#### Public Water System Supervision (PWSS) Grant Program
State drinking water program agencies in the 50 states receive federal support through PWSS grants to:
- developing and maintaining an inventory of public water systems throughout the state; developing and maintaining a database to hold compliance information on public water systems; conducting sanitary surveys of public water systems; reviewing public water system plans and specifications; providing technical assistance to managers and operators of public water systems; carrying out a program to ensure that the public water systems regularly inform their consumers about the quality of the water that they are providing; certifying laboratories that can perform the analysis of drinking water that will be used to determine compliance with the regulations; and carrying out an enforcement program to ensure that the public water systems comply with all of the state's requirements.

### 3. Public Water System Classifications

#### Community Water System (CWS)
Community Water System (CWS): A public water system that supplies water to the same population year-round. Of the 156,000 public water systems, approximately 51,000 are community water systems (CWS) that serve most people in the United States (a little less than 300 million).

#### Non-Transient Non-Community Water System (NTNCWS)
Non-Transient Non-Community Water System (NTNCWS): A public water system that regularly supplies water to at least 25 of the same people at least six months per year. Some examples are schools, factories, office buildings, and hospitals which have their own water systems.

#### Transient Non-Community Water System (TNCWS)
Transient Non-Community Water System (TNCWS): A public water system that provides water in a place such as a gas station or campground where people do not remain for long periods of time.

### 4. Drinking Water Standards and Regulations

#### Maximum Contaminant Levels (MCLs)
Maximum Contaminant Level (MCL) - The highest level of a contaminant that is allowed in drinking water. MCLs are set as close to MCLGs as feasible using the best available treatment technology and taking cost into consideration. MCLs are enforceable standards.

#### Maximum Contaminant Level Goals (MCLGs)
Maximum Contaminant Level Goal (MCLG) - The level of a contaminant in drinking water below which there is no known or expected risk to health. MCLGs allow for a margin of safety and are non-enforceable public health goals.

#### Treatment Techniques (TT)
Treatment Technique (TT) - A required process intended to reduce the level of a contaminant in drinking water. When there is no reliable method that is economically and technically feasible to measure a contaminant at concentrations to indicate there is not a health concern, EPA sets a treatment technique rather than an MCL.

#### National Primary vs. Secondary Standards
- **Primary Standards (NPDWRs)**: The National Primary Drinking Water Regulations (NPDWR) are legally enforceable primary standards and treatment techniques that apply to public water systems.
- **Secondary Standards (NSDWRs)**: EPA has established National Secondary Drinking Water Standards that set non-mandatory water quality standards for 15 contaminants. EPA does not enforce these "secondary maximum contaminant levels" (SMCLs). They are established as guidelines to assist public water systems in managing their drinking water for aesthetic considerations, such as taste, color, and odor.

### 5. Surface Water Treatment Rules (SWTRs)

#### Purpose and Scope
EPA has developed the Surface Water Treatment Rules (SWTRs) to improve your drinking water quality. The regulations provide protection from disease-causing pathogens, such as Giardia lamblia, Legionella, and Cryptosporidium.

#### Key Requirements
The SWTRs requires water systems to filter and disinfect surface water sources. Some water systems are allowed to use disinfection only for surface water sources that meet criteria for water quality and watershed protection.

#### Evolution of Rules
The SWTRs include several related regulations:
- Surface Water Treatment Rule (SWTR)
- Interim Enhanced Surface Water Treatment Rule (IESWTR)
- Long Term 1 Enhanced Surface Water Treatment Rule (LT1ESWTR)
- Long Term 2 Enhanced Surface Water Treatment Rule (LT2ESWTR)
- Filter Backwash Recycling Rule

### 6. Compliance and Enforcement

#### Violation Categories
Monitoring and Reporting - Failure to conduct regular monitoring of drinking water quality, or to submit monitoring results in a timely fashion to the state primacy agency or EPA, as required by SDWA. Public Notice - Violations of the public notification requirements, which require systems to alert consumers if there is a serious problem with their drinking water or if there have been other violations of system requirements, as required by SDWA. Other - Violations of other requirements of SDWA, such as failing to issue annual consumer confidence reports.

#### Enforcement Response
Resolved - The violation has at least one resolving enforcement action. In SDWIS, this indicates that either the system has returned to compliance from the violation, the rule that was violated was no longer applicable, or no further action was needed. Archived - The violation is not Resolved, but is more than five years past its noncompliance period end date. In keeping with the Enforcement Response Policy, the violation no longer contributes to the public water system's overall compliance status. Unresolved violations are also marked as Archived when a system ceases operations (becomes inactive). Addressed - The violation is not Resolved or Archived, and is addressed by one or more formal enforcement actions. Unaddressed - The violation is not Resolved or Archived, and has not been addressed by formal enforcement.

### 7. Data Management and Reporting Systems

#### ECHO Integration
The Enforcement and Compliance History Online (ECHO) system incorporates Public Water Systems data from EPA's Safe Drinking Water Information System (SDWIS) database.

#### Exchange Network
This data flow allows users to submit data to the U.S. EPA's Safe Drinking Water Information System (SDWIS). SDWIS is an EPA national database that contains information about public water systems and their violations of EPA's drinking water regulations. Agencies submit federally reported drinking water data to EPA based on three separate subject areas (i.e., Inventory, Actions, and Samples).

### 8. Implications for DWV Development

#### Integration Requirements
The DWV must be designed to:
1. Interface with existing SDWIS data structures and schemas
2. Support the hierarchical relationship between EPA, primacy agencies, and public water systems
3. Accommodate different regulatory requirements across states
4. Handle various violation types and enforcement statuses
5. Support different user roles (public, operators, laboratories, regulators)

#### Data Considerations
- Real-time integration with SDWIS/STATE systems where available
- Handling of quarterly reporting cycles and data lag
- Support for both regulated and unregulated contaminant data
- Accommodation of treatment technique requirements where MCLs don't exist

#### Compliance Support Features
The system should facilitate:
- Monitoring schedule tracking
- Violation status tracking
- Public notification requirements
- Consumer Confidence Report generation support
- Integration with state-specific requirements

### Conclusion

Understanding these regulatory frameworks and existing systems is essential for developing a DWV that effectively serves all stakeholders in the drinking water ecosystem. The solution must balance public access needs with regulatory compliance requirements while integrating seamlessly with existing federal and state information systems.