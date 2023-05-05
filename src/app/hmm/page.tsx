import { myAction } from "../_actions";

export default function Page() {
  return (
    <form action={myAction}>
      <button type="submit">perform server action</button>
    </form>
  );
}
