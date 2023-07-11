import { GoogleMap } from "#src/components/GoogleMap";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  return <GoogleMap />;
}
