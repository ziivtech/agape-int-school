import Hero from "@/components/Hero";
import IntroStory from "@/components/IntroStory";
import EducationalJourney from "@/components/EducationalJourney";
import AcademicExcellence from "@/components/AcademicExcellence";
import ChristianEducation from "@/components/ChristianEducation";
import GlobalPerspective from "@/components/GlobalPerspective";
import StudentLifeMosaic from "@/components/StudentLifeMosaic";
import StudentLeadership from "@/components/StudentLeadership";
import Wellbeing from "@/components/Wellbeing";
import CampusPreview from "@/components/CampusPreview";
import GlobalPathways from "@/components/GlobalPathways";
import StudentStories from "@/components/StudentStories";
import ParentStories from "@/components/ParentStories";
import NewsSection from "@/components/NewsSection";
import EventsTimeline from "@/components/EventsTimeline";
import PrincipalMessage from "@/components/PrincipalMessage";
import AdmissionsCTA from "@/components/AdmissionsCTA";
import { getPublishedNews, getUpcomingEvents } from "@/lib/content/server";
import { toEventItem, toNewsCard } from "@/lib/content/public-types";

export default async function HomePage() {
  const [news, events] = await Promise.all([getPublishedNews(3), getUpcomingEvents(6)]);

  return (
    <main>
      <Hero />
      <IntroStory />
      <EducationalJourney />
      <AcademicExcellence />
      <ChristianEducation />
      <GlobalPerspective />
      <StudentLifeMosaic />
      <StudentLeadership />
      <Wellbeing />
      <CampusPreview />
      <GlobalPathways />
      <StudentStories />
      <ParentStories />
      <NewsSection articles={news.map(toNewsCard)} />
      <EventsTimeline events={events.map(toEventItem)} />
      <PrincipalMessage />
      <AdmissionsCTA />
    </main>
  );
}
