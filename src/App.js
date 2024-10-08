import "./styles.css";
import Home from "./routes/Home";
import { Route, Routes } from "react-router-dom";
import About from "./routes/About";
import Service from "./routes/Service";
import Contact from "./routes/Contact";
import MyTrips from './components/MyTrips';

import BookingsTable from "./components/MyTrips";
import TicketView from "./components/TicketView";

export default function App() {
  return (
    <div className="App">
     
      <Routes>        
        <Route path="/" element={<Home />} />
        <Route path="/BookingsTable" element={<BookingsTable />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/MyTrips" element={<MyTrips />} />
        <Route path="/view-ticket/:bookingId" element={<TicketView />} />

      </Routes>
    </div>
  );
}
