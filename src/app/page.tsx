export default function Home() {
  const someEnvVar = process.env.NEXT_PUBLIC_HELLO;
  return <div className="bg-orange-400">{someEnvVar}</div>;
}
