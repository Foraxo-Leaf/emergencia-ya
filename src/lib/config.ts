
import { MessageCircle, Phone, MapPin } from "lucide-react";

export const SAMCO_DATA = {
    name: "Samco Armstrong - Guardia 24 hs",
    address: "Pasaje Pedro Rolando 1590, Armstrong, Santa Fe",
    mapsQuery: "SAMCO+Armstrong,+Pasaje+Pedro+Rolando+1590,+Armstrong,+Santa+Fe",
    whatsapp: "543471533033",
};

export const CONTACT_DATA = {
    samco: SAMCO_DATA,
    monitoringCenter: {
        name: "Centro de Monitoreo",
        address: "Bv. Auden y Dante Alighieri",
        mapsQuery: "Centro+de+Monitoreo+Armstrong",
        phone: "109",
    },
    police: {
        name: "Policía",
        address: "Comando Radioeléctrico",
        phone: "101",
    },
    firefighters: {
        name: "Bomberos Voluntarios",
        address: "Dick y Fischer",
        phone: "100",
    },
    ambulance: {
        phone: "107",
    }
};

export const usefulCenters = [
    CONTACT_DATA.samco,
    CONTACT_DATA.monitoringCenter,
    CONTACT_DATA.police,
    CONTACT_DATA.firefighters,
];
