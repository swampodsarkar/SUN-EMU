/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmulatorView from "./components/EmulatorView";
import ControllerView from "./components/ControllerView";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<EmulatorView />} />
          <Route path="/controller/:code?" element={<ControllerView />} />
        </Routes>
      </div>
    </Router>
  );
}
