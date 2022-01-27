import { init } from "../packages/async-hooks-thing";

export default function Home() {
  return <h1>abc</h1>;
}

export const getInitialProps =
  typeof window === "undefined"
    ? () => {
        init();
        return { hmm: 234 * Math.random() };
      }
    : undefined;
