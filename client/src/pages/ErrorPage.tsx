import { useRouteError, Link } from "react-router-dom";
import { RoutePath } from "../main";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={RoutePath.ROOT}>Go Back</Link>
    </div>
  );
}
