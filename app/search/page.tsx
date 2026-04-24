import { Suspense } from "react";
<<<<<<< HEAD
import SearchPage from "./SearchPage";

export default function Search() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPage />
        </Suspense>
    );
=======
import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchResults />
    </Suspense>
  );
>>>>>>> 4ed32269fd4cfdde75449931b2ef0038ed7ed195
}