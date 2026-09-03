/* Question library — shared data + behavior for all four pages.
   Content captured from the live Question library v2 (my.effectory.com, 2026-08-31).
   Copy fixes vs live: "peformed"→"performed", "behaviour"→"behavior",
   "top questions sets"→"top question sets". Everything else is verbatim. */
window.QL = (function () {
  "use strict";

  var ORG = "Questionnaire Logincode Migration"; // this project's org-name variable

  /* Answer types: L Likert · O Other · N eNPS · T Open text.
     Chip pattern from the survey-settings-questionnaire reference (.q-scale / .q-scale-icon). */
  var TYPES = {
    L: { cls: "is-scale",  icon: "point-scale",        label: "Likert",
         tip: "Strongly agree\nAgree\nNeither agree nor disagree\nDisagree\nStrongly disagree" },
    O: { cls: "is-choice", icon: "check-square",       label: "Other",
         tip: "Custom answer options" },
    N: { cls: "is-nps",    icon: "net-promoter-score", label: "eNPS",
         tip: "Scale from 10 to 0" },
    T: { cls: "is-open",   icon: "text-entry",         label: "Open text",
         tip: "Open-ended answer" }
  };

  var TOPICS = [
    { name: "Work enjoyment", qs: [
      ["I am satisfied with my job as a whole", "L"],
      ["I am enthusiastic about my job", "L"],
      ["I enjoy doing my work / tasks", "L"],
      ["The work I do is meaningful", "L"],
      ["I am proud of the work I deliver", "L"],
      ["I enjoy taking on new tasks and responsibilities", "L"]]},
    { name: "Work enablement", qs: [
      ["I am enabled to do my work efficiently", "L"],
      ["I am provided with good work resources (tools, devices, software, materials, etc.) to do my job well", "L"],
      ["I am enabled to do my work while working from a remote location (tools, devices, access, etc.)", "L"],
      ["What hinders you in doing your work remotely? You may select multiple topics", "O"],
      ["Important information is readily accessible for me", "L"]]},
    { name: "Work performance", qs: [
      ["At work I get to do what I do best", "L"],
      ["I understand how my work contributes to {org}'s strategy", "L"],
      ["I am willing to go beyond the scope of my defined tasks to contribute to the success of {org}", "L"],
      ["My skills and abilities fit in well with my job", "L"],
      ["I can decide how to do my work", "L"],
      ["I have the ability to organize my tasks", "L"],
      ["I have the freedom to make decisions at work", "L"],
      ["I know what results are expected of me at work", "L"],
      ["I know what tasks I need to carry out to do my work well", "L"],
      ["I take the initiative whenever I see room for improvement", "L"],
      ["I take the initiative to stay informed regarding developments within {org}", "L"]]},
    { name: "Wellbeing and workload", qs: [
      ["At work I feel fit and energetic", "L"],
      ["I experience a good balance between work and my personal life", "L"],
      ["I have enough time to do my work", "L"],
      ["Doing my work gives me energy", "L"],
      ["My workload is", "O"],
      ["I can cope well with my workload", "L"],
      ["At work I am able to deal with stress effectively", "L"],
      ["I am able to maintain a good balance between working and relaxing", "O"],
      ["I feel that the way I currently work is sustainable for the next three months", "L"],
      ["Time flies when I am working", "L"],
      ["I have experienced undesirable behavior by colleagues in the past year (such as verbal aggression, physical abuse, sexual harassment, bullying, discrimination, etc.)", "O"],
      ["I have experienced undesirable behavior by customers/clients in the past year (such as verbal aggression, physical abuse, sexual harassment, bullying, discrimination, etc.)", "O"]]},
    { name: "Work environment and conditions", qs: [
      ["I am satisfied with my working conditions (physical environment)", "L"],
      ["I can do my work undisturbed by unnecessary rules and procedures", "L"],
      ["I feel safe while I work", "L"],
      ["I feel empowered to act in the event of unsafe situations", "L"],
      ["{org} takes appropriate action in the event of unsafe situations", "L"],
      ["My salary is determined fairly", "L"],
      ["I am well paid compared to other people outside {org}", "L"],
      ["My pay aligns with my level of responsibility and performance", "L"]]},
    { name: "Team dynamics", qs: [
      ["I enjoy working with my colleagues", "L"],
      ["I have confidence in my colleagues", "L"],
      ["I feel appreciated by my colleagues", "L"],
      ["My colleagues honor their agreements", "L"],
      ["I can count on my colleagues for help if needed", "L"],
      ["My team and I give each other feedback on performance", "L"],
      ["My team and I give each other feedback on behavior", "L"],
      ["My colleagues provide me with the necessary information to do my work", "L"],
      ["I feel safe to talk to my colleagues about their behavior", "L"],
      ["I would feel safe to openly discuss a mistake I made", "L"]]},
    { name: "Team collaboration and performance", qs: [
      ["My team's goals are clear", "L"],
      ["My team understands what needs to be done to contribute to the success of {org}", "L"],
      ["My team contributes to the success of {org}", "L"],
      ["In my team we collaborate well", "L"],
      ["In my team work is done efficiently", "L"],
      ["My team puts the customer/client first", "L"],
      ["My team performs well", "L"],
      ["My team is productive", "L"],
      ["People in my team focus on the right things", "L"],
      ["I feel responsible for the results delivered by my team", "L"],
      ["People in my team take responsibility for their projects/tasks", "L"],
      ["In my team we make work-related decisions efficiently", "L"],
      ["In my team we proactively take steps to improve what we do and deliver", "L"],
      ["In my team we leverage each other's strengths", "L"],
      ["My team regularly develops good ideas for improvement", "L"]]},
    { name: "Team leadership", qs: [
      ["I am satisfied with my manager", "L"],
      ["I have confidence in my manager", "L"],
      ["I feel appreciated by my {manager}", "L"],
      ["I have a good working relationship with my manager", "L"],
      ["I am regularly given useful performance feedback", "L"],
      ["My manager motivates me in my work", "L"],
      ["My manager is clear about my objectives", "L"],
      ["My manager encourages my development", "L"],
      ["My manager is open to suggestions", "L"],
      ["My manager informs me when I've performed well", "L"],
      ["My manager informs me when my work can be improved", "L"],
      ["My manager treats me with respect", "L"],
      ["My manager informs me about important matters", "L"],
      ["My manager sets a good example for my team", "L"],
      ["My manager leads changes in an exemplary manner", "L"],
      ["My manager delivers on their promises", "L"],
      ["My manager supports me in achieving my objectives", "L"],
      ["I feel safe to talk to my manager about their behavior", "L"],
      ["My manager values different opinions in my team", "L"]]},
    { name: "Company strategy", qs: [
      ["{org}'s goals and strategy are clear to me", "L"],
      ["I support {org}'s goals and strategy", "L"],
      ["The vision for the future of {org} inspires me", "L"],
      ["I care about the future of {org}", "L"]]},
    { name: "Company leadership", qs: [
      ["I have confidence in {org}'s management", "L"],
      ["Management is aware of what is happening on the work floor", "L"],
      ["Management communicates clearly about major developments within {org}", "L"],
      ["{org} is open to suggestions and new ideas", "L"]]},
    { name: "Company communication and collaboration", qs: [
      ["Collaboration between my team and other teams within {org} is effective", "L"],
      ["Within {org} there is a clear decision-making process", "L"],
      ["Within {org} work processes are well organised", "L"],
      ["Employees communicate openly within {org}", "L"],
      ["There is good communication between different teams within {org}", "L"],
      ["I feel there are sufficient opportunities to take part in discussions about organization-wide subjects", "L"]]},
    { name: "Company culture", qs: [
      ["{org} is a good organization to work for", "L"],
      ["I am proud to work at {org}", "L"],
      ["I feel that I fit in at {org}", "L"],
      ["I feel appreciated by {org}", "L"],
      ["{org} puts the customer/client first", "L"],
      ["I identify with the culture of {org}", "L"],
      ["{org} offers me a challenging work environment", "L"],
      ["{org} offers me enough job security", "L"],
      ["Within {org} employees are treated in a fair manner", "L"],
      ["Within {org} performance is rewarded", "L"],
      ["{org} trusts that I do my job in the best way possible", "L"],
      ["I receive praise and recognition when I perform well", "L"],
      ["{org} pays sufficient attention to corporate social responsibility (such as sustainability, volunteering, community outreach etc.)", "L"],
      ["I am optimistic about the future of {org}", "L"]]},
    { name: "Diversity, Equity and Inclusion", qs: [
      ["I can be myself around everyone I work with", "L"],
      ["I am accepted the way I am within my immediate work environment", "L"],
      ["I can share my opinions openly without fear of reprisal/repercussion", "L"],
      ["My work environment is free from bullying and harassment", "L"],
      ["{org} is committed to supporting a culture of inclusion", "L"],
      ["Within my immediate work environment, everyone is treated equally and with respect regardless of their background or personal characteristics", "L"],
      ["People of all backgrounds (culture, ethnicity, gender, sexual orientation, age, religion etc.) can succeed at {org}", "L"]]},
    { name: "Change management", qs: [
      ["I understand why change is necessary within {org}", "L"],
      ["I understand how changes within {org} have an impact on my day-to-day activities", "L"],
      ["{org} provides relevant and timely information during times of change", "L"],
      ["I am able to deal with changes effectively", "L"],
      ["I receive sufficient support in times of change", "L"],
      ["I handle personnel changes in my team effectively", "L"],
      ["I receive timely information about upcoming changes", "L"],
      ["My manager takes responsibility for change", "L"],
      ["My manager helps me adapt to new ways of working", "L"]]},
    { name: "Feedback and action", qs: [
      ["{org} uses employees' ideas and suggestions to improve", "L"],
      ["In my team we have taken action based on previous survey results", "L"],
      ["I can see clear improvements as a result of sharing feedback within {org}", "L"]]},
    { name: "Growth and development", qs: [
      ["I am satisfied with my development opportunities", "L"],
      ["I have good opportunities to develop myself professionally and personally", "L"],
      ["My job offers me sufficient opportunities to acquire new knowledge", "L"],
      ["{org} offers me good training opportunities", "L"],
      ["My current knowledge and skills allow me to easily find another job", "L"],
      ["I would like to continue working at {org} for the next one to two years", "L"],
      ["I have taken serious action to look for another job over the past three months, or plan to do so in the next three months", "O"]]},
    { name: "eNPS", qs: [
      ["How likely is it that you would recommend {org} as an employer to others?", "N"]]},
    { name: "Topics of pride", qs: [
      ["What are you most proud of within {org}?", "O"],
      ["What makes you proud of this? Please give a short description", "T"]]},
    { name: "Topics to improve", qs: [
      ["What needs improvement within {org}?", "O"],
      ["What could your organization do better? Please give a short description", "T"]]}
  ];

  var THEMES = [
    { name: "Alignment", desc: [
      "Alignment refers to a shared understanding of organizational goals and objectives across all your organizational units. This understanding will ensure that the performance and participation of your employees are in line with your organization's strategy.",
      "The score for alignment shows the extent to which employees are aware of their organization’s vision and objectives as well as whether your employees feel like they can contribute to this vision and these objectives."],
      qs: ["I understand how my work contributes to {org}'s strategy", "{org}'s goals and strategy are clear to me", "I support {org}'s goals and strategy"] },
    { name: "Autonomy", desc: [
      "Autonomy refers to the extent to which your employees experience a sense of choice and psychological freedom when doing their job.",
      "The score for autonomy shows your organization’s willingness to give its employees freedom and independence in performing their tasks. When your employees feel a certain degree of autonomy, they are more likely to be intrinsically motivated to complete their tasks."],
      qs: ["I have the freedom to make decisions at work", "I have the ability to organize my tasks", "I can decide how to do my work"] },
    { name: "Change Management", desc: [
      "Change management deals with a combination of preparation and adaptability in the face of change. It is about the extent to which your organization prepares, informs and enables employees to adapt to changes in the future.",
      "Your change management score shows how well your organization enables and encourages employees to deal well with change. When you succeed in doing so, your employees will understand the purpose of change and perform in line with your expectations."],
      qs: ["I understand how changes within {org} have an impact on my day-to-day activities", "I receive sufficient support in times of change", "{org} provides relevant and timely information during times of change"] },
    { name: "Customer focus", desc: [
      "Customer focus is about identifying your internal stakeholders’ and customers’ wishes and requirements, anticipating these wishes, and acting accordingly.",
      "High scores on customer focus mean that your employees prioritize the needs of your stakeholders and customers."],
      qs: ["My team puts the customer/client first", "{org} puts the customer/client first"] },
    { name: "Employer Excellence", desc: [
      "Organisations who work on employership provide their employees with a work environment where they feel at home and accepted. Such a work environment enhances your employees' feeling of being connected with their colleagues and your organization.",
      "High scores on employer excellence mean your employees feel part of a community, appreciated, inspired and cared for at your organization. In such an environment, your employees will perform better and remain with the organization for a longer period because they are intrinsically motivated."],
      qs: ["The vision for the future of {org} inspires me", "I feel appreciated by {org}", "{org} is a good organization to work for", "{org} uses employees' ideas and suggestions to improve"] },
    { name: "Enablement", desc: [
      "Workplace enablement refers to how your organization addresses the needs of your employees to work efficiently, productively and happily. According to different work processes in and across organizations, it is important to enable work conditions that facilitate high levels of functioning.",
      "High scores on enablement show that you've put the right tools, equipment, software, training and work processes in place for your employees to perform their tasks in the best possible way."],
      qs: ["I am provided with good work resources (tools, devices, software, materials, etc.) to do my job well", "At work I get to do what I do best", "Within {org} work processes are well organised"] },
    { name: "Engagement", desc: [
      "Engagement is the degree to which your employees are inspired and energized by their work. It also refers to their positive connection to your organization. Engaged employees experience their work as meaningful and rewarding, are proud of their jobs, and feel that they fit in at the organization. They can go the extra mile because they love what they do and where they work.",
      "Your engagement score will tell you how enthusiastic your employees are about their work and how connected they feel to your organization."],
      qs: ["I enjoy doing my work / tasks", "Doing my work gives me energy", "I am proud to work at {org}", "I feel that I fit in at {org}"] },
    { name: "Inclusion", desc: [
      "Inclusion refers to employees being accepted by a group and feeling a sense of authenticity and belonging. In an inclusive work climate, your employees can behave themselves in line with their true selves.",
      "A high score on inclusion tells you that there is a positive connection between your employees and their team and organization. Such a work environment enables (psychological) safety and leads to satisfaction and reduced absenteeism."],
      qs: ["I am accepted the way I am within my immediate work environment", "I can be myself around everyone I work with", "Within my immediate work environment, everyone is treated equally and with respect regardless of their background or personal characteristics"] },
    { name: "Ownership", desc: [
      "Ownership is the degree to which your employees feel that they can act with a sense of authority when making organizational decisions. It also refers to the degree to which they feel responsible for the consequences of these decisions.",
      "A high score on ownership shows that your employees are willing to be held accountable for their team’s actions as well as their own performance."],
      qs: ["I am willing to go beyond the scope of my defined tasks to contribute to the success of {org}", "I feel responsible for the results delivered by my team", "People in my team take responsibility for their projects/tasks"] },
    { name: "Psychological safety", desc: [
      "Psychological safety refers to the sense of feeling safe among a group of individuals. In a safe work environment, your employees feel safe enough to give feedback about each other’s behaviors and work, and openly discuss their own and others’ mistakes.",
      "Your score on psychological safety shows the degree to which your employees are comfortable sharing their opinions with their colleagues, and whether feedback is welcome in your organization."],
      qs: ["I would feel safe to openly discuss a mistake I made", "I feel safe to talk to my colleagues about their behavior", "I feel safe to talk to my manager about their behavior"] },
    { name: "Role clarity", desc: [
      "Role clarity refers to the clarity about your employees’ and teams’ responsibilities and priorities; what is expected of them, their way of working, and how they can contribute to the organization.",
      "High scores on role clarity mean that your employees and teams know what to do and when, and what their goals are."],
      qs: ["I know what tasks I need to carry out to do my work well", "I know what results are expected of me at work", "My team's goals are clear"] },
    { name: "Leading change", desc: [
      "Leading Change should aim to let employees know what has to be changed, why, and how, and to obtain their backing for the necessary changes. For this, managers need to involve their teams in the process so that they understand and trust them. Involvement is particularly important in unsettling situations that inevitably occur during ongoing change."],
      qs: ["My team understands what needs to be done to contribute to the success of {org}", "My team regularly develops good ideas for improvement", "I have confidence in my manager", "My manager leads changes in an exemplary manner", "I identify with the culture of {org}"] },
    { name: "Managing People", desc: [
      "People management ensures employees know the company’s expectations and can apply their knowledge and skills accordingly. This includes constructive feedback and recognition to show that good performance is acknowledged and well-rewarded in the company."],
      qs: ["My skills and abilities fit in well with my job", "I know what results are expected of me at work", "I am regularly given useful performance feedback", "Within {org} performance is rewarded", "I receive praise and recognition when I perform well"] },
    { name: "Managing Systems", desc: [
      "Well-managed systems enable employees to reach the expected performance by providing them with the necessary working conditions. This includes good working tools, effective work processes, good collaboration on different levels, and the availability of development opportunities."],
      qs: ["Important information is readily accessible for me", "I am provided with good work resources (tools, devices, software, materials, etc.) to do my job well", "In my team we collaborate well", "Within {org} work processes are well organised", "I have good opportunities to develop myself professionally and personally"] },
    { name: "Performance Environment", desc: [
      "A performance environment refers to the conditions that enable employees to work efficiently and effectively. It provides the right circumstances for optimal performance. Employees and managers need such an environment to fully utilize their potential individually and within the teams."],
      qs: ["Important information is readily accessible for me", "I am provided with good work resources (tools, devices, software, materials, etc.) to do my job well", "My skills and abilities fit in well with my job", "I know what results are expected of me at work", "My team understands what needs to be done to contribute to the success of {org}", "In my team we collaborate well", "My team regularly develops good ideas for improvement", "I have confidence in my manager", "I am regularly given useful performance feedback", "My manager leads changes in an exemplary manner", "I support {org}'s goals and strategy", "The vision for the future of {org} inspires me", "Within {org} work processes are well organised", "I identify with the culture of {org}", "Within {org} performance is rewarded", "I receive praise and recognition when I perform well", "Within {org} employees are treated in a fair manner", "I have good opportunities to develop myself professionally and personally"] },
    { name: "Providing Direction", desc: [
      "Providing Direction should aim to make employees enthusiastic about the company’s vision, familiar with and convinced by the company’s strategy, and feel treated in a fair and just manner within the overall “ecosystem” of their company. Then, the employees will also be willing to go along with strategically necessary changes."],
      qs: ["I support {org}'s goals and strategy", "The vision for the future of {org} inspires me", "Within {org} employees are treated in a fair manner"] },
    { name: "Sustainable employability", desc: [
      "Sustainable employability refers to the extent to which your employees can do their job well and keep on performing within your organization, both now and later in their careers. Four factors play a role, namely good work conditions that minimize work strains, skill sets and abilities that match their jobs, sufficient development opportunities, and how dedicated your employees are to the future of your organization.",
      "High scores on sustainable employability show that the work conditions you provide help your employees do their best and enable them to keep on performing in the long run."],
      qs: ["My skills and abilities fit in well with my job", "I am satisfied with my working conditions (physical environment)", "I care about the future of {org}", "I am satisfied with my development opportunities"] },
    { name: "Team Leadership", desc: [
      "A leader’s primary purpose is to provide clear guidance with a clear vision to their team, while motivating and encouraging team members by setting a good example. In contemporary work settings, such leaders can help team members with their growth, stimulate creativity and facilitate performance.",
      "High scores on team leadership show that your team members are satisfied with their leaders and benefit from their guidance."],
      qs: ["My manager motivates me in my work", "My manager encourages my development", "My manager sets a good example for my team", "My manager supports me in achieving my objectives"] },
    { name: "Team productivity", desc: [
      "Team productivity refers to how much output is gained by a team’s effort. It’s important to maximize a team's productivity by focusing on efficient and effective processes.",
      "High scores on team productivity show that your team members help each other setting goals, achieving organizational objectives, and with their personal development through feedback. Productive teams are more likely to perform well consistently."],
      qs: ["My team and I give each other feedback on performance", "My team contributes to the success of {org}", "People in my team focus on the right things"] },
    { name: "Teamwork", desc: [
      "Teamwork refers to the collaboration of a team to achieve their shared goals. Teamwork is about helping each other and supporting each other when working together.",
      "High scores on teamwork illustrate the collegiality, cooperation, and cohesiveness of your team. Such teams are more likely to be positive about working together and perform better than teams with low scores on teamwork."],
      qs: ["My team and I give each other feedback on behavior", "My colleagues honor their agreements", "My colleagues provide me with the necessary information to do my work", "In my team we collaborate well"] },
    { name: "Trust", desc: [
      "Trust refers to how willing your employees are to embrace their own and others' vulnerability at work. Trust consists of three components: if you trust someone to be a good person (benevolence), if you trust someone's work (ability) and if you can trust someone to walk the way they talk (integrity). Effectory measures trust on three levels: trust in colleagues, trust in management, and received trust from the organization.",
      "The score for trust gives you an idea about your employees’ best intentions for one another, whether they believe in each other's abilities, and whether the organization and employees adhere to the promises and agreements that are made."],
      qs: ["I have confidence in my colleagues", "I have confidence in my manager", "{org} trusts that I do my job in the best way possible"] }
  ];

  /* ── Flexible QL (V1) data — custom questions, approval requests, survey usage ── */
  var CUSTOM = [
    { text: "I feel well informed about our office move to Utrecht", type: "L",
      topic: "Company culture", added: "12 May 2026",
      usedIn: [["Pulse check July 2026", "completed"]] },
    { text: "The new expense tool saves me time", type: "L",
      topic: "Work enablement", added: "8 Apr 2026",
      usedIn: [["Engagement survey Q3 2026", "running"]] },
    { text: "What would make our Monday stand-ups more useful?", type: "T",
      topic: "Team collaboration and performance", added: "3 Jun 2026", usedIn: [] },
    /* personal: created by the current user, not yet available to everyone */
    { text: "I know who to contact when a handover is unclear", type: "L",
      topic: "Team collaboration and performance", added: "1 Sep 2026", usedIn: [], avail: false }
  ];
  var PENDING = [
    { text: "My team has enough budget to organize team activities", type: "L",
      topic: "Team dynamics", by: "Lisa Vermeer · Manager, Customer Support", date: "28 Aug 2026" },
    { text: "I can easily find the sales materials I need", type: "L",
      topic: "Work enablement", by: "Ruben Bakker · Manager, Sales", date: "29 Aug 2026" }
  ];
  /* ── seeded edge case: a year of accumulated custom content (toolbar toggle).
     Near-duplicates, stale one-offs and a few gems — the messy state the
     research brief's findability & cleanup tasks need. ── */
  var MESSY = [
    { text: "I feel supported by my manager", type: "L", topic: "Team leadership", added: "14 Jan 2026", by: "Rob Janssen" },
    { text: "My manager supports me when needed", type: "L", topic: "Team leadership", added: "3 Feb 2026", by: "Fatima el Idrissi" },
    { text: "I get enough support from my manager", type: "L", topic: "Team leadership", added: "19 Feb 2026", by: "Rob Janssen" },
    { text: "Support from my direct manager is sufficient", type: "L", topic: "Team leadership", added: "2 Mar 2026", by: "Sanne de Boer" },
    { text: "My manager gives me the support I need to do my job", type: "L", topic: "Team leadership", added: "17 Mar 2026", by: "Priya Sharma" },
    { text: "I know where to find the hybrid working guidelines", type: "L", topic: "Work enablement", added: "21 Oct 2025", by: "Sanne de Boer" },
    { text: "The move to the new intranet is going smoothly", type: "L", topic: "Company communication and collaboration", added: "12 Nov 2025", by: "Rob Janssen", avail: false },
    { text: "I can find a quiet space in the office when I need one", type: "L", topic: "Work environment and conditions", added: "5 Dec 2025", by: "Fatima el Idrissi" },
    { text: "Parking near the office is easy to find", type: "L", topic: "Work environment and conditions", added: "5 Dec 2025", by: "Fatima el Idrissi", avail: false },
    { text: "The cafeteria offers enough healthy options", type: "L", topic: "Work environment and conditions", added: "8 Jan 2026", by: "Milan Kovács" },
    { text: "The IT helpdesk resolves my issues quickly", type: "L", topic: "Work enablement", added: "22 Jan 2026", by: "Milan Kovács" },
    { text: "I understand how the new company values apply to my work", type: "L", topic: "Company culture", added: "9 Apr 2026", by: "Priya Sharma" },
    { text: "The DEI training gave me practical tools", type: "L", topic: "Diversity, Equity and Inclusion", added: "16 Apr 2026", by: "Sanne de Boer" },
    { text: "I use the wellbeing app regularly", type: "O", topic: "Wellbeing and workload", added: "28 Apr 2026", by: "Rob Janssen", avail: false },
    { text: "My workload changed after the reorganisation", type: "O", topic: "Wellbeing and workload", added: "6 May 2026", by: "Fatima el Idrissi" },
    { text: "The new CRM makes my work easier", type: "L", topic: "Work enablement", added: "20 May 2026", by: "Milan Kovács" },
    { text: "My onboarding buddy helped me settle in", type: "L", topic: "Team dynamics", added: "27 May 2026", by: "Priya Sharma" },
    { text: "Our quarterly goals are clear to me", type: "L", topic: "Company strategy", added: "10 Jun 2026", by: "Sanne de Boer" },
    { text: "Most meetings I attend are a good use of my time", type: "L", topic: "Company communication and collaboration", added: "24 Jun 2026", by: "Rob Janssen" },
    { text: "I get enough uninterrupted focus time", type: "L", topic: "Wellbeing and workload", added: "8 Jul 2026", by: "Fatima el Idrissi" },
    { text: "What would make our office days more valuable?", type: "T", topic: "Work environment and conditions", added: "22 Jul 2026", by: "Milan Kovács" },
    { text: "I attended the summer offsite", type: "O", topic: "Company culture", added: "12 Aug 2026", by: "Priya Sharma", avail: false }
  ];
  function seedOn() { try { return localStorage.getItem("ql.seed") === "1"; } catch (e) { return false; } }
  /* every custom question in play: the base ones, plus the seeded year when on */
  function customQuestions() {
    var base = CUSTOM.map(function (c) { return Object.assign({ by: "You" }, c); });
    return seedOn() ? base.concat(MESSY) : base;
  }

  /* ── Fixed version, Viva Glint model: the library is one governed list, and
     custom questions people create in surveys land in an incoming list until
     the coordinator adds them to the library. ── */
  var INBOX = [
    /* a support cluster, a workload cluster and a finding-things cluster sit
       in here — the similar-question suggestions find them */
    { text: "I feel supported by my manager", type: "L", by: "Rob Janssen", added: "14 Jan 2026", uses: 4 },
    { text: "My manager supports me when needed", type: "L", by: "Fatima el Idrissi", added: "3 Feb 2026", uses: 2 },
    { text: "I get enough support from my manager", type: "L", by: "Sanne de Boer", added: "19 Feb 2026", uses: 1 },
    { text: "My workload is realistic", type: "L", by: "Priya Sharma", added: "11 Mar 2026", uses: 5 },
    { text: "The amount of work I have is realistic", type: "L", by: "Tom Verhoeven", added: "2 Jun 2026", uses: 2 },
    { text: "I can handle my current workload", type: "L", by: "Lisa Vermeer", added: "18 Aug 2026", uses: 1 },
    { text: "I can quickly find the information I need for my work", type: "L", by: "Milan Kovács", added: "9 Apr 2026", uses: 3 },
    { text: "I know where to find the information I need", type: "L", by: "Sanne de Boer", added: "22 Jul 2026", uses: 1 },
    { text: "My team has enough budget to organize team activities", type: "L", by: "Lisa Vermeer", added: "28 Aug 2026", uses: 3 },
    { text: "I can easily find the sales materials I need", type: "L", by: "Ruben Bakker", added: "29 Aug 2026", uses: 1 },
    { text: "I feel safe to report unsafe situations on the work floor", type: "L", by: "Tom Verhoeven", added: "19 Mar 2026", uses: 4 },
    { text: "The onboarding of new colleagues in our team goes well", type: "L", by: "Fatima el Idrissi", added: "5 Feb 2026", uses: 2 },
    { text: "I had a good work-life balance this quarter", type: "L", by: "Fatima el Idrissi", added: "16 Jul 2026", uses: 2 },
    { text: "Our quarterly goals are achievable", type: "L", by: "Rob Janssen", added: "12 Jun 2026", uses: 2 },
    { text: "I have the right access rights to the systems I need", type: "L", by: "Milan Kovács", added: "26 Feb 2026", uses: 1 },
    { text: "The travel policy for client visits is clear", type: "L", by: "Priya Sharma", added: "30 Apr 2026", uses: 1 },
    { text: "The canteen offers enough vegetarian options", type: "L", by: "Sanne de Boer", added: "14 May 2026", uses: 1 },
    { text: "What would make our internal newsletter more useful?", type: "T", by: "Rob Janssen", added: "8 Jan 2026", uses: 1 },
    { text: "How could we improve our Friday knowledge sessions?", type: "T", by: "Milan Kovács", added: "21 Aug 2026", uses: 1 }
  ];
  /* promotions persist for the session, so a question added from the incoming
     list is really in the library afterwards */
  function libStore() { try { return JSON.parse(sessionStorage.getItem("ql.lib") || "[]"); } catch (e) { return []; } }
  function libAdd(q) {
    try {
      var l = libStore(); l.push(q);
      sessionStorage.setItem("ql.lib", JSON.stringify(l));
    } catch (e) {}
  }
  /* custom questions IN the library: the available base set plus session promotions */
  function libraryCustom() {
    return CUSTOM.filter(function (c) { return c.avail !== false; }).concat(libStore());
  }
  function inboxGone() { try { return JSON.parse(sessionStorage.getItem("ql.inboxGone") || "[]"); } catch (e) { return []; } }
  function inboxRemove(texts) {
    try { sessionStorage.setItem("ql.inboxGone", JSON.stringify(inboxGone().concat(texts))); } catch (e) {}
  }
  /* the incoming list: others' questions, the user's own not-yet-library ones,
     plus the seeded year of accumulation — minus what was already added */
  function inboxQuestions() {
    var seen = {}, gone = {};
    inboxGone().forEach(function (t) { gone[t] = true; });
    var all = INBOX
      .concat(CUSTOM.filter(function (c) { return c.avail === false; }).map(function (c) {
        return { text: c.text, type: c.type, by: "You", added: c.added, uses: 1 };
      }))
      .concat(seedOn() ? MESSY.map(function (m) {
        return { text: m.text, type: m.type, by: m.by, added: m.added, uses: 1 };
      }) : []);
    var out = [];
    all.forEach(function (q) {
      if (seen[q.text] || gone[q.text]) return;
      seen[q.text] = true;
      out.push(q);
    });
    return out;
  }

  /* default usage for standard questions (shown in the edit panel) */
  var USAGE = [
    ["Engagement survey Q3 2026", "running"],
    ["Pulse check July 2026", "completed"],
    ["Central employee listening 2026", "planned"]
  ];
  var STATUS_TAG = {
    running: '<span class="tag tag-brand">Running</span>',
    completed: '<span class="tag tag-positive">Completed</span>',
    planned: '<span class="tag is-planned">Planned</span>',
    draft: '<span class="tag is-draft">Draft</span>'
  };

  /* ── Templates (from the "Edit & create templates in QL" Figma — Templates tab).
     A section is ["Topic name", count] (a slice of that library topic) or
     {name, qs} for template-only questions. ── */
  var TEMPLATES = [
    { slug: "team-development-scan", name: "Team Development Scan", custom: false, status: "published", img: "sos-template",
      desc: "<p>Understand how your teams collaborate, lead and grow. Use it to spot team strengths and the areas that need attention.</p>",
      sections: [["Team dynamics", 5], ["Team collaboration and performance", 5], ["Team leadership", 5]] },
    { slug: "strategic-fitness-model", name: "Strategic Fitness Model", custom: false, status: "published", img: "sf-template",
      desc: "<p>Measures how fit your organization is to execute its strategy: direction, leadership, communication and culture.</p>",
      sections: [["Company strategy", 4], ["Company leadership", 4], ["Company communication and collaboration", 6], ["Company culture", 8]] },
    { slug: "world-class-workplace", name: "World-Class Workplace", custom: false, status: "unpublished", img: "wcwp-template",
      desc: "<p>The essentials of a world-class workplace: employees who enjoy their work and stay energized while doing it.</p>",
      sections: [["Work enjoyment", 5], ["Wellbeing and workload", 4]] },
    { slug: "dei", name: "Diversity, Equity & Inclusion (DEI)", custom: false, status: "published", img: "dei-template",
      desc: "<h2>Understand how your organization truly feels</h2>" +
        "<p>This template helps you understand how employees experience your workplace in terms of diversity, equity, and inclusion. It explores whether people feel respected and fairly treated, and whether your culture supports belonging for everyone — regardless of background, identity, or role.</p>" +
        "<h3>Why it matters</h3><ul>" +
        "<li><b>Identify strengths and blind spots:</b> Discover how different groups experience your organization and where inequities or barriers may exist.</li>" +
        "<li><b>Drive meaningful action:</b> Turn insights into initiatives that strengthen inclusion, fairness, and representation.</li>" +
        "<li><b>Track progress over time:</b> Use the results as a baseline for future DEI surveys and monitor cultural change.</li>" +
        "<li><b>Support transparency and trust:</b> Demonstrate to employees that leadership listens, learns, and acts on DEI feedback.</li></ul>" +
        "<h3>What’s inside</h3><p>This survey includes questions about:</p><ul>" +
        "<li>Feeling of <b>belonging and respect</b></li><li><b>Fairness</b> in opportunities and recognition</li>" +
        "<li><b>Psychological safety</b> and openness to different perspectives</li><li><b>Leadership commitment</b> to DEI</li>" +
        "<li><b>Accessibility</b> and inclusive practices</li></ul>",
      sections: [["Diversity, Equity and Inclusion", 7], ["Company culture", 14], ["eNPS", 1]] },
    { slug: "onboarding", name: "Onboarding", custom: false, status: "unpublished", img: "psa-template",
      desc: "<p>A short check-in for new colleagues in their first weeks.</p>",
      sections: [{ name: "Your first weeks", qs: [
        ["I received the information I needed before my first day", "L"],
        ["I felt welcome during my first week", "L"]] }] },
    { slug: "template-about-work", name: "Template about work", custom: true, status: "unpublished", img: null,
      desc: "", sections: [] }
  ];
  function templateSections(t) {
    return (t.sections || []).map(function (s) {
      if (s.name) return { name: s.name, qs: s.qs.map(function (q) { return { text: q[0], type: q[1], custom: !!q[2] }; }) };
      var topic = TOPICS.filter(function (x) { return x.name === s[0]; })[0];
      return { name: s[0], qs: (topic ? topic.qs.slice(0, s[1]) : []).map(function (q) { return { text: q[0], type: q[1], custom: false }; }) };
    });
  }
  function templateCount(t) {
    return templateSections(t).reduce(function (n, s) { return n + s.qs.length; }, 0);
  }
  /* session overlay: created/duplicated templates, renames and status changes
     survive navigation within the session */
  function tplState() { try { return JSON.parse(sessionStorage.getItem("ql.tpl") || "{}"); } catch (e) { return {}; } }
  function saveTplState(s) { try { sessionStorage.setItem("ql.tpl", JSON.stringify(s)); } catch (e) {} }
  function allTemplates() {
    var s = tplState();
    var list = TEMPLATES.map(function (t) {
      var o = Object.assign({}, t);
      if (s.status && s.status[t.slug]) o.status = s.status[t.slug];
      if (s.names && s.names[t.slug]) o.name = s.names[t.slug];
      return o;
    });
    (s.custom || []).forEach(function (c) {
      list.push(Object.assign({ custom: true, status: "unpublished", img: null, desc: "", sections: [] }, c,
        (s.status && s.status[c.slug]) ? { status: s.status[c.slug] } : {},
        (s.names && s.names[c.slug]) ? { name: s.names[c.slug] } : {}));
    });
    return list;
  }
  function getTemplate(slug) { return allTemplates().filter(function (t) { return t.slug === slug; })[0]; }
  function setTplStatus(slug, status) { var s = tplState(); s.status = s.status || {}; s.status[slug] = status; saveTplState(s); }
  function setTplName(slug, name) { var s = tplState(); s.names = s.names || {}; s.names[slug] = name; saveTplState(s); }
  function addCustomTemplate(tpl) { var s = tplState(); s.custom = s.custom || []; s.custom.push(tpl); saveTplState(s); }

  var LANGS = [
    { flag: "🇺🇸", label: "English (United States)" },
    { flag: "🇳🇱", label: "Dutch (Netherlands)" },
    { flag: "🇵🇹", label: "Portuguese (Portugal)" }
  ];

  /* ── helpers ── */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fill(s) { return s.split("{org}").join(ORG).split("{manager}").join("manager"); }
  function matches(text, term) { return !term || fill(text).toLowerCase().indexOf(term.toLowerCase()) !== -1; }
  function hl(text, term) {
    var t = esc(fill(text));
    if (!term) return t;
    var safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return t.replace(new RegExp(safe, "gi"), function (m) { return "<mark>" + m + "</mark>"; });
  }
  var orgQuestions = TOPICS.reduce(function (acc, t) {
    return acc.concat(t.qs.filter(function (q) { return q[0].indexOf("{org}") !== -1; }));
  }, []);

  /* icon-only type tile; the tooltip names the type and its answer scale */
  function scaleChip(type) {
    var t = TYPES[type];
    return '<span class="q-scale-icon ' + t.cls + '" data-tt="' + esc(t.label + "\n" + t.tip).replace(/\n/g, "&#10;") + '" aria-label="' + esc(t.label) + '"><i data-icon="' + t.icon + '"></i></span>';
  }

  /* ── prototype-local layout CSS (tokens only), shared by all four pages ── */
  var CSS = "\n" +
    /* responsive page padding (design-system §2: desktop 48/64, tablet 32/24, mobile 24/16) */
    ":root { --page-y: calc(var(--spacing-loose) * 2); --page-x: calc(var(--spacing-extra-loose) * 2); }\n" +
    "@media (max-width:1199px) { :root { --page-y: var(--spacing-extra-loose); --page-x: var(--spacing-loose); } }\n" +
    "@media (max-width:575px)  { :root { --page-y: var(--spacing-loose); --page-x: var(--spacing-base); } }\n" +
    "body { background: var(--bg-interface-body); }\n" +
    /* the [hidden] attribute must always win, also on flex/inline-flex components */
    "[hidden] { display: none !important; }\n" +
    ".app { display: flex; height: 100vh; overflow: hidden; }\n" +
    ".app .mainnav { height: 100%; }\n" +
    /* always show the scroll track so short pages don't shift the content */
    ".app-main { flex: 1; min-width: 0; height: 100vh; overflow-y: scroll; scrollbar-gutter: stable; }\n" +
    ".app-main-inner { max-width: calc(1200px + 2 * var(--page-x)); margin-inline: auto; padding: var(--spacing-extra-loose) var(--page-x) var(--page-y); display: flex; flex-direction: column; gap: var(--spacing-loose); }\n" +
    ".breadcrumb { padding-inline: var(--page-x); }\n" +
    /* page header: title + Beta tag on one line; tabs inside the header */
    ".ph-title-row { display: flex; align-items: center; gap: var(--spacing-base-tight); }\n" +
    ".ph .ph-row { padding-bottom: 0; }\n" +
    /* tabs are real links here; the Tabs component has no text underline */
    ".ph-tabs .ph-tab { text-decoration: none; }\n" +
    /* toolbar (language select + search + collapse) */
    ".ql-toolbar { display: flex; align-items: flex-end; gap: var(--spacing-base-tight); }\n" +
    ".ql-lang { min-width: 240px; }\n" +
    ".ql-lang .slt-lbl { display: inline-flex; align-items: center; gap: var(--spacing-extra-tight); }\n" +
    ".ql-lang .slt-lbl i { width: 14px; height: 14px; display: flex; color: var(--content-secondary); }\n" +
    /* the language menu is appended to <body> and positioned fixed (never clipped) */
    "body > .menu { position: fixed; z-index: 1000; width: max-content; min-width: 240px; }\n" +
    ".ql-toolbar .search-wrap { margin-left: auto; width: 280px; }\n" +
    /* questionnaire rows — pattern from the survey-settings-questionnaire reference */
    ".q-head { display: flex; align-items: center; gap: var(--spacing-base-tight); margin-bottom: var(--spacing-base-tight); }\n" +
    ".q-head h2 { margin: 0; color: var(--content-base); }\n" +
    ".q-count { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; padding: 0 var(--spacing-tight); background: var(--bg-tertiary); color: var(--content-base); border-radius: var(--radius-full); font-size: 12px; font-weight: 600; }\n" +
    ".q-topic + .q-topic { margin-top: var(--spacing-extra-loose); }\n" +
    ".q-list { background: var(--bg-base); border: 1px solid var(--border-base); border-radius: var(--radius-md); overflow: hidden; }\n" +
    ".q-row { display: flex; align-items: center; gap: var(--spacing-tight); padding: var(--spacing-base) var(--spacing-loose); border-bottom: 1px solid var(--border-base); }\n" +
    ".q-row:last-child { border-bottom: none; }\n" +
    ".q-text { flex: 1; min-width: 0; color: var(--content-base); }\n" +
    ".q-scale { flex-shrink: 0; display: flex; align-items: center; gap: var(--spacing-tight); width: 168px; color: var(--content-base); }\n" +
    ".q-scale-icon { flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); }\n" +
    ".q-scale-icon i { width: 16px; height: 16px; display: flex; }\n" +
    ".q-scale-icon.is-scale  { background: var(--bg-brand-subtle);         color: var(--content-accent-turquoise); }\n" +
    ".q-scale-icon.is-choice { background: var(--bg-accent-yellow-subtle); color: var(--content-accent-yellow); }\n" +
    ".q-scale-icon.is-open   { background: var(--bg-accent-orange-subtle); color: var(--content-accent-orange); }\n" +
    ".q-scale-icon.is-nps    { background: var(--bg-accent-blue-subtle);   color: var(--content-accent-blue); }\n" +
    ".tag.is-standard { flex-shrink: 0; background: var(--bg-brand-subtle); color: var(--content-accent-turquoise); }\n" +
    "mark { background: var(--bg-highlight-subtle); color: inherit; border-radius: var(--radius-sm); padding: 0; }\n" +
    /* accordion extras: kind chip + question rows inside a theme/topic panel */
    ".acc-header .chip-sm { flex-shrink: 0; }\n" +
    ".ql-about { display: grid; grid-template-columns: 1fr 360px; gap: var(--spacing-loose); margin-bottom: var(--spacing-base); }\n" +
    ".ql-about p { margin: 0 0 var(--spacing-base-tight); color: var(--content-secondary); }\n" +
    ".ql-video { aspect-ratio: 16 / 9; border-radius: var(--radius-md); background: var(--bg-brand-subtle); display: flex; align-items: center; justify-content: center; }\n" +
    ".ql-qrow { display: flex; align-items: center; gap: var(--spacing-super-loose); padding: var(--spacing-base-tight) 0; border-bottom: 1px solid var(--border-base); color: var(--content-base); }\n" +
    ".ql-qrow:last-child { border-bottom: none; }\n" +
    ".ql-qrow .q-text { flex: 1; }\n" +
    "@media (max-width:900px) { .ql-about { grid-template-columns: 1fr; } .q-scale { width: auto; } .q-scale span:last-child { display: none; } }\n" +
    /* fixed-layer tooltip (never clipped by overflow:hidden ancestors) */
    ".ql-tt { position: fixed; z-index: 2000; pointer-events: none; }\n" +
    /* dialogs */
    ".dialog-media img { width: 100%; height: 100%; object-fit: cover; display: block; }\n" +
    ".ql-var-chip { display: inline-flex; margin-top: var(--spacing-extra-tight); }\n" +
    ".ql-var-list { max-height: 320px; overflow-y: auto; margin-top: var(--spacing-base-tight); }\n" +
    ".ql-var-row { padding: var(--spacing-base-tight) 0; border-bottom: 1px solid var(--border-base); color: var(--content-base); line-height: 1.9; }\n" +
    ".ql-var-row:last-child { border-bottom: none; }\n" +
    ".lm-grid { display: grid; grid-template-columns: 200px 1fr; gap: var(--spacing-loose); min-height: 0; }\n" +
    ".lm-nav { display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-base-tight); }\n" +
    ".lm-nav .btn-link { white-space: normal; text-align: left; height: auto; }\n" +
    ".lm-art { max-height: 60vh; overflow-y: auto; padding-right: var(--spacing-base); }\n" +
    ".lm-art h3 { margin: var(--spacing-extra-loose) 0 var(--spacing-base-tight); color: var(--content-base); }\n" +
    ".lm-art h3:first-child { margin-top: 0; }\n" +
    ".lm-art h4 { display: flex; align-items: center; gap: var(--spacing-tight); margin: var(--spacing-loose) 0 var(--spacing-tight); color: var(--content-base); font-size: 14px; font-weight: 600; }\n" +
    ".lm-art p { margin: 0 0 var(--spacing-base-tight); color: var(--content-secondary); }\n";

  function injectCSS() {
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  injectCSS();

  /* ── overlay open/close with the DS exit animation (SKILL rule 9) ── */
  function openOverlay(html) {
    var host = document.createElement("div");
    host.innerHTML = html;
    var overlay = host.firstElementChild;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeOverlay(overlay); });
    overlay.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", function () { closeOverlay(overlay); });
    });
    if (window.Icons) window.Icons.render();
    return overlay;
  }
  function closeOverlay(overlay) {
    overlay.classList.add("is-closing");
    var surface = overlay.querySelector(".sidepanel, .dialog");
    var done = function () { overlay.remove(); };
    if (surface && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      surface.addEventListener("animationend", done, { once: true });
    } else { done(); }
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var open = document.querySelectorAll(".overlay:not(.is-closing)");
      if (open.length) closeOverlay(open[open.length - 1]);
    }
  });

  /* ── system notification ── */
  function notify(title, desc) {
    var stack = document.querySelector(".sysnotif-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "sysnotif-stack";
      document.body.appendChild(stack);
    }
    var n = document.createElement("div");
    n.className = "sysnotif";
    n.setAttribute("role", "status");
    n.innerHTML = '<div class="sysnotif-title">' + esc(title) + "</div>" +
      (desc ? '<div class="sysnotif-desc">' + esc(desc) + "</div>" : "") +
      '<button class="sysnotif-close" aria-label="Dismiss"><i data-icon="cross"></i></button>';
    stack.appendChild(n);
    n.querySelector(".sysnotif-close").addEventListener("click", function () { n.remove(); });
    if (window.Icons) window.Icons.render();
    setTimeout(function () { n.remove(); }, desc ? 5000 : 4000);
  }

  /* ── publish mechanic: a labeled change log, reviewed and published (fully or
     partially) in a diff dialog — the failsafe the models promise ── */
  function changesList() { try { return JSON.parse(localStorage.getItem("ql.changes2") || "[]"); } catch (e) { return []; } }
  function saveChangesList(l) { try { localStorage.setItem("ql.changes2", JSON.stringify(l)); } catch (e) {} }
  function changesCount() { return changesList().length; }
  function trackChange(label) {
    var l = changesList();
    l.push(String(label || "Change"));
    saveChangesList(l);
    updatePublish();
  }
  function updatePublish() {
    var b = document.getElementById("btnPublish");
    if (!b) return;
    var n = changesCount();
    b.disabled = !n;
    b.classList.toggle("is-disabled", !n);
    b.innerHTML = '<i data-icon="send"></i> Publish' + (n ? " (" + n + ")" : "");
    if (window.Icons) window.Icons.render();
  }
  /* a human summary of the selected changes: what they are, in plain words */
  function summarizeChanges(labels) {
    var c = { added: 0, combined: 0, wording: 0, edited: 0, moved: 0, topics: 0, renamed: 0, removed: 0, other: 0 };
    labels.forEach(function (s) {
      if (/^Added topic/.test(s)) c.topics++;
      else if (/^Combined/.test(s)) c.combined++;
      else if (/^Added|^Approved/.test(s)) c.added++;
      else if (/^Selected alternative wording/.test(s)) c.wording++;
      else if (/^Edited/.test(s)) c.edited++;
      else if (/^Moved|^Reordered/.test(s)) c.moved++;
      else if (/^Renamed/.test(s)) c.renamed++;
      else if (/^Deleted|unavailable”?$/.test(s)) c.removed++;
      else c.other++;
    });
    var parts = [];
    function add(n, one, many) { if (n) parts.push(n === 1 ? one : n + " " + many); }
    add(c.added, "1 new question in the library", "new questions in the library");
    add(c.combined, "1 group of similar questions combined into one", "groups of similar questions combined");
    add(c.wording, "1 new wording for a benchmarked question", "new wordings for benchmarked questions");
    add(c.edited, "1 improved question", "improved questions");
    add(c.moved, "1 question in a better place", "questions in a better place");
    add(c.topics, "1 new topic", "new topics");
    add(c.renamed, "1 clearer name", "clearer names");
    add(c.removed, "1 question removed", "questions removed");
    add(c.other, "1 other change", "other changes");
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  }
  function publishDialog() {
    var l = changesList();
    if (!l.length) return;
    var overlay = openOverlay(
      '<div class="overlay"><div class="dialog dialog-s" role="dialog" aria-modal="true" aria-labelledby="pub-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header is-sm"><div class="dialog-header-top">' +
      '<span class="dialog-header-icon"><i data-icon="send"></i></span>' +
      '<h3 class="dialog-title" id="pub-title">Ready to publish?</h3></div>' +
      '<p class="dialog-subtitle" id="pubSummary"></p></div>' +
      '<div class="dialog-body" style="max-height: 44vh; overflow-y: auto; display: flex; flex-direction: column; gap: var(--spacing-tight);">' +
      '<div class="text-l6" style="color: var(--content-subtle);">Your changes</div>' +
      l.map(function (c, i) {
        return '<label class="cb-label-wrap"><span class="cb-wrap"><input type="checkbox" class="cb" checked data-i="' + i + '" /></span>' + esc(c) + "</label>";
      }).join("") +
      '<p class="text-medium" style="margin: var(--spacing-tight) 0 0; color: var(--content-secondary);">Everyone who creates surveys and templates gets your updated library right away. Surveys that are already running keep the questions they have — nothing changes for participants.</p>' +
      "</div>" +
      '<div class="dialog-footer"><button class="btn btn-secondary" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="pubGo"></button></div>' +
      "</div></div>"
    );
    var go = overlay.querySelector("#pubGo");
    var summaryEl = overlay.querySelector("#pubSummary");
    function selected() {
      var out = [];
      overlay.querySelectorAll(".cb:checked").forEach(function (cb) { out.push(l[+cb.getAttribute("data-i")]); });
      return out;
    }
    function renderGo() {
      var sel = selected();
      go.textContent = sel.length ? "Publish selected (" + sel.length + ")" : "Publish selected";
      go.disabled = !sel.length;
      go.classList.toggle("is-disabled", !sel.length);
      summaryEl.textContent = sel.length
        ? "You're about to make your library better: " + summarizeChanges(sel) + "."
        : "Select the changes you want to make live.";
    }
    overlay.querySelectorAll(".cb").forEach(function (cb) { cb.addEventListener("change", renderGo); });
    renderGo();
    go.addEventListener("click", function () {
      var keep = [];
      overlay.querySelectorAll(".cb").forEach(function (cb) {
        if (!cb.checked) keep.push(l[+cb.getAttribute("data-i")]);
      });
      var published = l.length - keep.length;
      saveChangesList(keep);
      updatePublish();
      closeOverlay(overlay);
      notify(published === 1 ? "1 change is live" : published + " changes are live",
        keep.length
          ? "Everyone creating surveys sees your updated library. Your other changes stay saved here until you publish them."
          : "Everyone creating surveys and templates now works with your updated library.");
    });
  }
  function initPublish() {
    var b = document.getElementById("btnPublish");
    if (!b) return;
    updatePublish();
    b.addEventListener("click", publishDialog);
  }

  /* ── fixed-layer tooltip on [data-tt] (reference-doc pattern: never clipped) ── */
  var ttEl = null;
  function showTT(target) {
    hideTT();
    ttEl = document.createElement("div");
    ttEl.className = "tooltip is-above ql-tt";
    var lines = target.getAttribute("data-tt").split("\n");
    lines.forEach(function (line, i) {
      if (i) ttEl.appendChild(document.createElement("br"));
      ttEl.appendChild(document.createTextNode(line));
    });
    document.body.appendChild(ttEl);
    var r = target.getBoundingClientRect();
    var w = ttEl.offsetWidth, h = ttEl.offsetHeight;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
    var top = r.top - h - 10;
    if (top < 8) { ttEl.classList.remove("is-above"); ttEl.classList.add("is-below"); top = r.bottom + 10; }
    ttEl.style.left = left + "px";
    ttEl.style.top = top + "px";
  }
  function hideTT() { if (ttEl) { ttEl.remove(); ttEl = null; } }
  document.addEventListener("mouseover", function (e) {
    var t = e.target.closest ? e.target.closest("[data-tt]") : null;
    if (t) showTT(t);
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest && e.target.closest("[data-tt]")) hideTT();
  });
  document.addEventListener("scroll", hideTT, true);

  /* ── language select (Single Select + Dropdown menu with the mandatory selected check) ── */
  var langIndex = 0;
  function initLang() {
    var wrap = document.querySelector(".ql-lang");
    if (!wrap) return;
    var slt = wrap.querySelector(".slt");
    var menu = null;
    function render() {
      slt.querySelector(".slt-val").textContent = LANGS[langIndex].flag + "  " + LANGS[langIndex].label;
    }
    function closeMenu() { if (menu) { menu.remove(); menu = null; } }
    slt.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu) return closeMenu();
      menu = document.createElement("div");
      menu.className = "menu";
      menu.setAttribute("role", "listbox");
      menu.innerHTML = LANGS.map(function (l, i) {
        return '<div class="menu-item' + (i === langIndex ? " is-selected" : "") + '" role="menuitemradio" aria-checked="' + (i === langIndex) + '" data-i="' + i + '">' +
          '<span class="menu-item-body"><span class="menu-item-title">' + l.flag + "  " + esc(l.label) + "</span></span>" +
          (i === langIndex ? '<i data-icon="check" class="menu-item-check"></i>' : "") +
          "</div>";
      }).join("");
      document.body.appendChild(menu);
      var r = slt.getBoundingClientRect();
      menu.style.left = r.left + "px";
      menu.style.top = (r.bottom + 4) + "px";
      menu.addEventListener("click", function (e2) {
        var item = e2.target.closest(".menu-item");
        if (!item) return;
        var i = +item.getAttribute("data-i");
        if (i !== langIndex) {
          langIndex = i;
          render();
          if (i !== 0) notify("This prototype shows English content only");
        }
        closeMenu();
      });
      if (window.Icons) window.Icons.render();
    });
    document.addEventListener("click", closeMenu);
    /* the menu is fixed-position: close it when the page scrolls away */
    document.addEventListener("scroll", function (e) {
      if (menu && !menu.contains(e.target)) closeMenu();
    }, true);
    render();
  }

  /* ── shared dialogs ── */
  function videoDialog() {
    openOverlay(
      '<div class="overlay"><div class="dialog dialog-s" role="dialog" aria-modal="true" aria-labelledby="vid-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header"><div class="dialog-header-top"><h3 class="dialog-title" id="vid-title">Video</h3></div>' +
      '<p class="dialog-subtitle">Videos aren’t included in this prototype.</p></div>' +
      '<div class="dialog-footer"><button class="btn btn-secondary" data-close>Close</button></div>' +
      "</div></div>"
    );
  }

  function scaleRow(cls, icon, label) {
    return '<h4><span class="q-scale-icon ' + cls + '"><i data-icon="' + icon + '"></i></span> ' + label + "</h4>";
  }
  function learnDialog() {
    var overlay = openOverlay(
      '<div class="overlay"><div class="dialog dialog-l" role="dialog" aria-modal="true" aria-labelledby="lm-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header"><div class="dialog-header-top"><h3 class="dialog-title" id="lm-title">Learn more about our questions</h3></div></div>' +
      '<div class="dialog-body lm-grid">' +
      '<div class="lm-nav">' +
      '<button class="btn btn-link" data-anchor="lm-about">About questions</button>' +
      '<button class="btn btn-link" data-anchor="lm-types">Question types and answer scales</button>' +
      '<button class="btn btn-link" data-anchor="lm-themes">Themes and topics</button>' +
      "</div>" +
      '<div class="lm-art text-medium">' +
      '<h3 class="text-l4" id="lm-about">About questions</h3>' +
      "<p>To help you find out what is going on within your organization, Effectory provides insight into HR themes, topics and questions that are the most relevant for organizational performance.</p>" +
      "<p>Every survey has different goals and selected content, but they have one thing in common: the content is always based on validated question sets that assess theory-based themes. This provides a strong base to develop short, understandable, valid, and reliable surveys that we analyze and report statistically.</p>" +
      "<p>All Effectory validated questions, topics and themes are benchmarked which helps you understand in the results how your employees feel compared to the employees of other organizations.</p>" +
      '<h3 class="text-l4" id="lm-types">Question types and answer scales</h3>' +
      "<p>Within our question library we have different answer scales and answer categories. Find out below what the differences are.</p>" +
      scaleRow("is-scale", "point-scale", "Likert scale") +
      "<p>This is a 5-point Likert answer scale. Our default answer category range is: Strongly agree – Agree – Neither agree nor disagree – Disagree – Strongly disagree.</p><p>The answers on rating scale questions will be translated into average scores.</p>" +
      scaleRow("is-scale", "point-scale", "10-point scale") +
      "<p>This is a 10-point Likert answer scale. This scale ranges from 10 to 0.</p><p>The answers on 10-point scale questions will be translated into average scores.</p>" +
      scaleRow("is-choice", "check-square", "Workload scale") +
      "<p>Workload refers to the experienced amount of work your employees are expected to do. Our default answer category range is: Far too low – Too low – Just right – Too high – Far too high. The report will consist of percentages on the answer options, in other words how many participants chose which questions.</p>" +
      scaleRow("is-choice", "check-square", "Retention scale") +
      "<p>Retention refers to employees staying with your organization for a long period of time. The answer categories of this question are: No – Yes, within my organization – Yes, outside my organization.</p><p>The retention score shows the percentage of your employees who are not looking for a job elsewhere and are thus willing to stay with your organization.</p>" +
      scaleRow("is-nps", "net-promoter-score", "(e)NPS") +
      "<p>The employee Net Promoter Score (eNPS) is based on one simple but powerful question to assess the enthusiasm of employees about their organization as an employer.</p>" +
      "<p>The scale range is: 10 (promoters) – 9 (promoters) – 8 (passives) – 7 (passives) – 6 (detractors) – 5 (detractors) – 4 (detractors) – 3 (detractors) – 2 (detractors) – 1 (detractors) – 0 (detractors).</p>" +
      "<p>The score is determined as follows: % promoters − % detractors.</p>" +
      scaleRow("is-open", "text-entry", "Open text") +
      "<p>A textual answer question is an open-ended question. A respondent can provide textual feedback to answer the question. Textual answer questions will be reported exactly as the respondent wrote them.</p>" +
      scaleRow("is-choice", "check-square", "Select options scale") +
      "<p>For custom answer category questions, we provide the select options scale. Multiple answers can be selected. The report will consist of percentages on the answer options, in other words how many participants chose which questions.</p>" +
      '<h3 class="text-l4" id="lm-themes">Themes and topics</h3>' +
      "<h4>Themes</h4>" +
      "<p>Effectory provides insight into HR themes that are the most relevant for organizational performance. Themes are based upon a mandatory set of questions. In the library you can find out why the theme could be relevant for your organization and which questions belong to this theme. Your theme score represents the average scores your employees gave to the questions that belong to a specific theme. Next to the average scores per question you will also see an average score per theme.</p>" +
      "<h4>Topics</h4>" +
      "<p>To categorize relevant questions surrounding a similar subject we also provide topics. The questions you see within a topic are all questions belonging to this specific question set. Your results will show scores per question.</p>" +
      "</div></div></div></div>"
    );
    overlay.querySelectorAll("[data-anchor]").forEach(function (b) {
      b.addEventListener("click", function () {
        var el = overlay.querySelector("#" + b.getAttribute("data-anchor"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function variableDialog(kind) {
    var name = kind === "org" ? ORG : "manager";
    var qs = kind === "org" ? orgQuestions.map(function (q) { return q[0]; }) : ["I feel appreciated by my {manager}"];
    var rows = qs.map(function (q) {
      var html;
      if (kind === "org") {
        html = esc(fill(q)).split(esc(ORG)).join('<span class="chip-sm">' + esc(ORG) + "</span>");
      } else {
        html = esc(q).replace("{manager}", '<span class="chip-sm">manager</span>');
      }
      return '<div class="ql-var-row text-medium">' + html + "</div>";
    }).join("");
    openOverlay(
      '<div class="overlay"><div class="dialog dialog-s" role="dialog" aria-modal="true" aria-labelledby="var-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header"><div class="dialog-header-top"><h3 class="dialog-title" id="var-title">Variable</h3></div></div>' +
      '<div class="dialog-body">' +
      '<div class="text-small" style="color: var(--content-secondary);">Variable</div>' +
      '<span class="chip-sm ql-var-chip">' + esc(name) + "</span>" +
      '<h4 class="text-l5" style="margin: var(--spacing-loose) 0 var(--spacing-extra-tight); color: var(--content-base);">Content with the variable</h4>' +
      '<p class="text-medium" style="margin:0; color: var(--content-secondary);">Check if the content makes sense with the variable.</p>' +
      '<div class="ql-var-list">' + rows + "</div>" +
      "</div>" +
      '<div class="dialog-footer"><button class="btn btn-secondary" data-close>Close</button></div>' +
      "</div></div>"
    );
  }

  /* ── generic fixed-position picker menu (Dropdown menu component, body-appended) ── */
  var pickOpen = null;
  function pickMenu(trigger, options, selectedIndex, cb) {
    if (pickOpen) { pickOpen.remove(); pickOpen = null; return; }
    var menu = document.createElement("div");
    menu.className = "menu";
    menu.setAttribute("role", "listbox");
    menu.style.maxHeight = "320px";
    menu.style.overflowY = "auto";
    menu.innerHTML = options.map(function (label, i) {
      return '<div class="menu-item' + (i === selectedIndex ? " is-selected" : "") + '" role="menuitemradio" aria-checked="' + (i === selectedIndex) + '" data-i="' + i + '">' +
        '<span class="menu-item-body"><span class="menu-item-title">' + esc(label) + "</span></span>" +
        (i === selectedIndex ? '<i data-icon="check" class="menu-item-check"></i>' : "") +
        "</div>";
    }).join("");
    document.body.appendChild(menu);
    var r = trigger.getBoundingClientRect();
    var top = r.bottom + 4;
    if (top + Math.min(menu.offsetHeight, 320) > innerHeight - 8) top = Math.max(8, r.top - menu.offsetHeight - 4);
    menu.style.left = Math.min(r.left, innerWidth - menu.offsetWidth - 8) + "px";
    menu.style.top = top + "px";
    /* every way out goes through close(), so the document listeners never
       outlive the menu — a stale click listener here ate the next open */
    var close = function () {
      if (pickOpen === menu) pickOpen = null;
      menu.remove();
      document.removeEventListener("click", closeOnDoc);
      document.removeEventListener("scroll", closeOnScroll, true);
    };
    menu.addEventListener("click", function (e) {
      var item = e.target.closest(".menu-item");
      if (!item) return;
      e.stopPropagation();
      close();
      cb(+item.getAttribute("data-i"));
    });
    var closeOnDoc = function () { close(); };
    /* fixed-position menus don't follow their trigger: close when anything
       scrolls (except the menu's own list) */
    var closeOnScroll = function (e) {
      if (menu.contains(e.target)) return;
      close();
    };
    setTimeout(function () {
      document.addEventListener("click", closeOnDoc);
      document.addEventListener("scroll", closeOnScroll, true);
    }, 0);
    pickOpen = menu;
    if (window.Icons) window.Icons.render();
  }

  /* ── Flexible QL flows ── */
  var TYPE_KEYS = ["L", "O", "N", "T"];

  function usageRows(usedIn) {
    if (!usedIn.length) {
      return '<p class="text-medium" style="margin:0; color: var(--content-secondary);">This question isn’t used in any surveys yet.</p>';
    }
    return usedIn.map(function (u) {
      return '<div class="ql-var-row text-medium" style="display:flex; align-items:center; gap: var(--spacing-base);">' +
        '<span style="flex:1; min-width:0;">' + esc(u[0]) + "</span>" + STATUS_TAG[u[1]] +
        "</div>";
    }).join("");
  }

  /* Edit question — side panel with usage + propagation confirm on save.
     q: {text, type, custom, added, usedIn}; cb(action, updated) with action save|delete */
  function editPanel(q, cb) {
    var usedIn = q.usedIn || USAGE;
    var overlay = openOverlay(
      '<div class="overlay is-right"><div class="sidepanel sidepanel-sm is-sm-header" role="dialog" aria-modal="true" aria-labelledby="ep-title">' +
      '<div class="sp-header is-compact">' +
      '<div class="sp-heading is-sm"><h3 class="sp-title" id="ep-title">Edit question</h3>' +
      (q.custom ? '<p class="sp-subtitle">Custom question · added ' + esc(q.added || "") + "</p>" : '<p class="sp-subtitle">Standard question</p>') +
      "</div>" +
      '<div class="sp-toolbar"><div class="sp-actions"><i data-icon="cross" data-close role="button" tabindex="0" aria-label="Close" style="cursor:pointer;"></i></div></div>' +
      "</div>" +
      '<div class="sp-body">' +
      '<div class="ta-wrap"><label class="ta-lbl">Question</label><textarea class="ta" id="epText" rows="3">' + esc(fill(q.text)) + "</textarea></div>" +
      '<div class="slt-wrap" style="margin-top: var(--spacing-loose);"><div class="slt-lbl">Answer scale</div>' +
      '<div class="slt" tabindex="0" id="epScale"><span class="slt-left"><span class="slt-val">' + TYPES[q.type].label + '</span></span><i data-icon="chevron-down"></i></div></div>' +
      '<div style="margin-top: var(--spacing-super-loose);">' +
      '<div class="q-head"><h4 class="text-l5" style="margin:0;">Used in surveys</h4><span class="q-count">' + usedIn.length + "</span></div>" +
      usageRows(usedIn) +
      (usedIn.length ? '<p class="text-small" style="margin: var(--spacing-base-tight) 0 0; color: var(--content-secondary);">Changes to this question apply to every survey that uses it.</p>' : "") +
      "</div></div>" +
      '<div class="sp-footer">' +
      '<button class="btn btn-link-delete" id="epDelete" style="margin-right:auto;">Delete question</button>' +
      '<button class="btn btn-secondary" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="epSave">Save</button>' +
      "</div></div></div>"
    );
    var type = q.type;
    overlay.querySelector("#epScale").addEventListener("click", function (e) {
      e.stopPropagation();
      var trigger = e.currentTarget;
      pickMenu(trigger, TYPE_KEYS.map(function (k) { return TYPES[k].label; }), TYPE_KEYS.indexOf(type), function (i) {
        type = TYPE_KEYS[i];
        trigger.querySelector(".slt-val").textContent = TYPES[type].label;
      });
    });
    overlay.querySelector("#epSave").addEventListener("click", function () {
      var newText = overlay.querySelector("#epText").value.trim() || q.text;
      confirmDialog({
        icon: "warning",
        title: "Save changes to this question?",
        subtitle: usedIn.length ?
          "This question is used in " + usedIn.length + (usedIn.length === 1 ? " survey" : " surveys") + ". Your change applies to all of them." :
          "This question isn’t used in any surveys yet.",
        confirmLabel: "Save changes",
        danger: false
      }, function () {
        closeOverlay(overlay);
        notify(usedIn.length ? "Question updated in " + usedIn.length + (usedIn.length === 1 ? " survey" : " surveys") : "Question updated");
        cb("save", { text: newText, type: type });
      });
    });
    overlay.querySelector("#epDelete").addEventListener("click", function () {
      confirmDialog({
        icon: "error",
        title: "Delete this question?",
        subtitle: "It will be removed from your library. Surveys that already use it keep their own copy.",
        confirmLabel: "Delete",
        danger: true
      }, function () {
        closeOverlay(overlay);
        notify("Question deleted");
        cb("delete");
      });
    });
  }

  function confirmDialog(opts, onConfirm) {
    var iconCls = opts.icon === "error" ? " is-error" : opts.icon === "warning" ? " is-warning" : "";
    var overlay = openOverlay(
      '<div class="overlay"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="cf-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header is-sm">' +
      '<div class="dialog-header-top"><i class="dialog-header-icon' + iconCls + '" data-icon="' + (opts.icon === "error" ? "alert-circle" : "alert-triangle") + '"></i>' +
      '<h3 class="dialog-title" id="cf-title">' + esc(opts.title) + "</h3></div>" +
      '<p class="dialog-subtitle">' + esc(opts.subtitle) + "</p>" +
      "</div>" +
      '<div class="dialog-footer">' +
      '<button class="btn btn-secondary" data-close>Cancel</button>' +
      '<button class="btn ' + (opts.danger ? "btn-danger" : "btn-primary") + '" id="cfConfirm">' + esc(opts.confirmLabel) + "</button>" +
      "</div></div></div>"
    );
    overlay.querySelector("#cfConfirm").addEventListener("click", function () {
      closeOverlay(overlay);
      onConfirm();
    });
  }

  /* Add question — dialog; cb({text, type, topic}) */
  function addDialog(cb) {
    var topicNames = TOPICS.map(function (t) { return t.name; });
    var overlay = openOverlay(
      '<div class="overlay"><div class="dialog dialog-s" role="dialog" aria-modal="true" aria-labelledby="aq-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header"><div class="dialog-header-top"><h3 class="dialog-title" id="aq-title">Add a question</h3></div>' +
      '<p class="dialog-subtitle">Your question is added to this project’s library and can be used in any survey.</p></div>' +
      '<div class="dialog-body">' +
      '<div class="ta-wrap"><label class="ta-lbl">Question <span class="ta-required">*</span></label>' +
      '<textarea class="ta" id="aqText" rows="3" placeholder="For example: I feel supported by my team"></textarea></div>' +
      '<div style="display:flex; gap: var(--spacing-base); margin-top: var(--spacing-loose);">' +
      '<div class="slt-wrap" style="flex:1;"><div class="slt-lbl">Answer scale</div>' +
      '<div class="slt" tabindex="0" id="aqScale"><span class="slt-left"><span class="slt-val">Likert</span></span><i data-icon="chevron-down"></i></div></div>' +
      '<div class="slt-wrap" style="flex:1;"><div class="slt-lbl">Topic</div>' +
      '<div class="slt" tabindex="0" id="aqTopic"><span class="slt-left"><span class="slt-ph">Select a topic</span></span><i data-icon="chevron-down"></i></div></div>' +
      "</div></div>" +
      '<div class="dialog-footer">' +
      '<button class="btn btn-secondary" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="aqAdd">Add question</button>' +
      "</div></div></div>"
    );
    var type = "L", topicIndex = -1;
    overlay.querySelector("#aqScale").addEventListener("click", function (e) {
      e.stopPropagation();
      var t = e.currentTarget;
      pickMenu(t, TYPE_KEYS.map(function (k) { return TYPES[k].label; }), TYPE_KEYS.indexOf(type), function (i) {
        type = TYPE_KEYS[i];
        t.querySelector(".slt-left").innerHTML = '<span class="slt-val">' + TYPES[type].label + "</span>";
      });
    });
    overlay.querySelector("#aqTopic").addEventListener("click", function (e) {
      e.stopPropagation();
      var t = e.currentTarget;
      pickMenu(t, topicNames, topicIndex, function (i) {
        topicIndex = i;
        t.querySelector(".slt-left").innerHTML = '<span class="slt-val">' + esc(topicNames[i]) + "</span>";
      });
    });
    overlay.querySelector("#aqAdd").addEventListener("click", function () {
      var text = overlay.querySelector("#aqText").value.trim();
      if (!text || topicIndex < 0) {
        notify("Add a question and pick a topic first");
        return;
      }
      closeOverlay(overlay);
      notify("Question added to your library");
      cb({ text: text, type: type, topic: topicNames[topicIndex] });
    });
  }

  /* Rename theme/topic — small dialog; cb(newName) */
  function renameDialog(name, kindLabel, cb) {
    var overlay = openOverlay(
      '<div class="overlay"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="rn-title">' +
      '<button class="dialog-close" aria-label="Close" data-close><i data-icon="cross"></i></button>' +
      '<div class="dialog-header is-sm"><div class="dialog-header-top"><h3 class="dialog-title" id="rn-title">Rename ' + kindLabel + "</h3></div></div>" +
      '<div class="dialog-body"><div class="tf-wrap"><label class="tf-lbl">Name</label>' +
      '<div class="tf-field"><input class="tf" id="rnName" type="text" value="' + esc(name) + '" /></div></div></div>' +
      '<div class="dialog-footer">' +
      '<button class="btn btn-secondary" data-close>Cancel</button>' +
      '<button class="btn btn-primary" id="rnSave">Save</button>' +
      "</div></div></div>"
    );
    overlay.querySelector("#rnSave").addEventListener("click", function () {
      var v = overlay.querySelector("#rnName").value.trim();
      if (!v) return;
      closeOverlay(overlay);
      trackChange("Renamed " + kindLabel + " “" + name + "” to “" + v + "”");
      notify(kindLabel.charAt(0).toUpperCase() + kindLabel.slice(1) + " renamed", "Publish your changes to make them live in surveys.");
      cb(v);
    });
  }

  /* ── shared shell bindings (run per page after DOM is ready) ── */
  function initShell() {
    var learn = document.getElementById("btnLearnMore");
    if (learn) learn.addEventListener("click", learnDialog);
    document.querySelectorAll("[data-video]").forEach(function (b) {
      b.addEventListener("click", videoDialog);
    });
    var promoClose = document.getElementById("promoClose");
    if (promoClose) promoClose.addEventListener("click", function () {
      var bar = document.getElementById("promoBar");
      if (bar) bar.remove();
    });
    initLang();
    initPublish();
    /* the To review tab carries its count on every page of the Fixed version */
    var inboxTab = document.getElementById("tabInbox");
    if (inboxTab) inboxTab.textContent = "To review (" + inboxQuestions().length + ")";
  }
  document.addEventListener("DOMContentLoaded", initShell);

  return {
    ORG: ORG, TYPES: TYPES, TOPICS: TOPICS, THEMES: THEMES,
    CUSTOM: CUSTOM, PENDING: PENDING, USAGE: USAGE, STATUS_TAG: STATUS_TAG,
    esc: esc, fill: fill, hl: hl, matches: matches,
    orgQuestions: orgQuestions, scaleChip: scaleChip,
    openOverlay: openOverlay, closeOverlay: closeOverlay,
    variableDialog: variableDialog, videoDialog: videoDialog, notify: notify,
    pickMenu: pickMenu, editPanel: editPanel, confirmDialog: confirmDialog,
    addDialog: addDialog, renameDialog: renameDialog, trackChange: trackChange,
    TEMPLATES: TEMPLATES, templateSections: templateSections, templateCount: templateCount,
    allTemplates: allTemplates, getTemplate: getTemplate, setTplStatus: setTplStatus,
    setTplName: setTplName, addCustomTemplate: addCustomTemplate,
    seedOn: seedOn, customQuestions: customQuestions, changesList: changesList,
    libraryCustom: libraryCustom, libAdd: libAdd,
    inboxQuestions: inboxQuestions, inboxRemove: inboxRemove
  };
})();
