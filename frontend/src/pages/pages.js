import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Doctors = lazy(() => import("./Doctors"));
const DoctorDetails = lazy(() => import("./DoctorDetails"));
const Auth = lazy(() => import("./Auth"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const Appointments = lazy(() => import("./Appointments"));
const Profile = lazy(() => import("./Profile"));

export {
    Home,
    Doctors,
    DoctorDetails,
    Auth,
    About,
    Contact,
    Appointments,
    Profile
};