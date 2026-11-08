// Edit this file to update the site. Empty strings/arrays hide the matching UI.
export const profile = {
  name:'Muhamad Fatir', initials:'MF', branding:'IT Enthusiast | IT Support & Operations',
  headline:'IT Enthusiast & Operations Professional.',
  heroText:'An IT enthusiast and vocational accounting graduate with experience in administration, dental assistance, and beginner programming. Brings strong communication, time management, and Microsoft Office skills, with a keen interest in building a career in IT support and operations.',
  summary:['IT enthusiast and vocational accounting graduate with experience in administration, dental assistance, and beginner programming.','Skilled in Microsoft Office, administration, communication, and time management; seeking an opportunity to grow in IT support and operations.'],
  objective:'Seeking an entry-level opportunity in IT support or operations to apply transferable skills, learn on the job, and contribute to a professional team.',
  about:['IT enthusiast and vocational high school graduate from SMK Yadika 4, majoring in Accounting.','Brings experience in administrative work, dental assistance, and beginner programming, and is focused on developing a career in IT support and operations.'],
  traits:['Microsoft Office','Administration','Time Management','Communication','Willingness to Learn'],
  location:'Tangerang Selatan, Banten', phone:'0895-2929-1303', email:'muhamadfathir2202@gmail.com', github:'', linkedin:'', availability:'Ready to learn & contribute',
  cvFile:'Muhamad-Fatir-CV.pdf',
  education:[
    {institution:'SDN Paku Jaya 01',degree:'Elementary School',start:'2010',end:'2016'},
    {institution:'SMPN 16 Tangerang Selatan',degree:'Junior High School',start:'2016',end:'2019'},
    {institution:'SMK Yadika 4',degree:'Vocational High School — Accounting',start:'2019',end:'2022'},
  ] as {institution:string;degree:string;start:string;end:string;description?:string;achievements?:string[]}[],
  experience:[
    {type:'Experience',position:'Administrative Staff',org:'Kejaksaan RI Tangerang Selatan',duration:''},
    {type:'Experience',position:'Dental Assistant',org:'',duration:''},
    {type:'Experience',position:'Junior Programmer',org:'',duration:''},
  ] as {type:string;position:string;org:string;duration:string;description?:string;responsibilities?:string[];achievements?:string[]}[],
  languages:[] as {name:string;level:'Native'|'Fluent'|'Professional'|'Intermediate'|'Basic'}[],
  journey:[] as string[],
}
