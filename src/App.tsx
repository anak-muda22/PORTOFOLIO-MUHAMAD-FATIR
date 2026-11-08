import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { About, CareerInterests, Skills, Education, Experience, LearningJourney, Languages, Footer } from './components/Sections'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
export default function App(){
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem('theme')!=='light'}catch{return true}})
  useEffect(()=>{document.documentElement.classList.toggle('dark',dark);try{localStorage.setItem('theme',dark?'dark':'light')}catch{}},[dark])
  return <><Navbar dark={dark} toggle={()=>setDark(!dark)}/><main>
    <Hero/><About/><CareerInterests/><Skills/><Experience/><LearningJourney/><Projects/><Certificates/><Education/><Languages/><Contact/></main><Footer/></>
}
