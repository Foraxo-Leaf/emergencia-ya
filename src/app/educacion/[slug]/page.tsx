
import { educationTopics } from "@/lib/data/educationData";
import { EducationDetailClient } from "./EducationDetailClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return educationTopics.map((topic) => ({ slug: topic.slug }));
}

export default function EducationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <EducationDetailClient slug={params.slug} />;
}
