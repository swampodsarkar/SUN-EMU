/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import OSView from "./components/OSView";
import ControllerView from "./components/ControllerView";

export default function App() {
  return (
    <Router>
      <div className="h-full w-full bg-slate-950 text-white selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/os" element={<OSView />} />
          <Route path="/controller/:code?" element={<ControllerView />} />
        </Routes>
      </div>
    </Router>
  );
}
