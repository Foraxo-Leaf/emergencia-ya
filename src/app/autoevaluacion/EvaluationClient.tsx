
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Phone, MessageSquare, Stethoscope, MessageCircle, MapPin, Loader2 } from "lucide-react";
import Link from 'next/link';
import {
    SMS_COORDS_PLACEHOLDER,
    SMS_LAT_PLACEHOLDER,
    SMS_LON_PLACEHOLDER,
    SMS_MAPS_URL_PLACEHOLDER,
    type ContactData,
} from '@/lib/config';
import { getDistance } from '@/lib/utils';

const allSymptoms = [
    { text: "¿Tenés Dolor de pecho?", isUrgent: true },
    { text: "¿Tenés dificultad para respirar?", isUrgent: true },
    { text: "¿Alguien se desmayó o perdió la conciencia?", isUrgent: true },
    { text: "¿Sufriste o estás en presencia de un accidente de tránsito o doméstico?", isUrgent: true },
    { text: "¿Tenés dolor abdominal leve o diarrea?", isUrgent: false },
    { text: "¿Tenés dolor leve de más de una semana de evolución?", isUrgent: false },
    { text: "¿Tenés tos, resfrío o dolor de garganta?", isUrgent: false },
];

type EvaluationClientProps = {
  contactData: ContactData;
};

type GeolocationStatus = 'pending' | 'loading' | 'success' | 'denied' | 'unsupported' | 'error' | 'outside';

export function EvaluationClient({ contactData }: EvaluationClientProps) {
    const [result, setResult] = useState<'urgent' | 'non-urgent' | null>(null);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('pending');
    
    const localAmbulanceNumber = contactData.ambulance.phone;
    const fallbackAmbulanceNumber = contactData.offlinePhones.ambulance;
    const emergencyPhoneNumber = geoStatus === 'success' ? localAmbulanceNumber : fallbackAmbulanceNumber;
    
    const smsRecipientNumber = contactData.samco.smsPhone;
    const smsBodyTemplate = contactData.sms.helpBodyTemplate;
    const whatsappTurnosNumber = contactData.samco.whatsapp;
    const { center: centerPoint, radiusKm } = contactData.geofence;

    const COORDINATE_DECIMALS = 5;

    const formatCoordinate = (value: number) => value.toFixed(COORDINATE_DECIMALS);

    const buildCoordinatesText = (coords: { latitude: number; longitude: number }) => {
        const lat = formatCoordinate(coords.latitude);
        const lon = formatCoordinate(coords.longitude);
        return { lat, lon, coordsText: `${lat},${lon}` };
    };

    const buildMapsUrl = (coordsText: string) => `https://www.google.com/maps?q=${coordsText}`;

    const buildSmsBody = (coords: { latitude: number; longitude: number }) => {
        const { lat, lon, coordsText } = buildCoordinatesText(coords);
        const mapsUrl = buildMapsUrl(coordsText);
        const template = (smsBodyTemplate ?? "").trim();
        const fallback = `Necesito ayuda.\nCoordenadas: ${coordsText}\nMapa: ${mapsUrl}`;

        if (!template) return fallback;

        const usesCoords =
            template.includes(SMS_COORDS_PLACEHOLDER) ||
            template.includes(SMS_LAT_PLACEHOLDER) ||
            template.includes(SMS_LON_PLACEHOLDER);
        const usesMaps = template.includes(SMS_MAPS_URL_PLACEHOLDER);

        const resolved = template
            .replaceAll(SMS_MAPS_URL_PLACEHOLDER, mapsUrl)
            .replaceAll(SMS_COORDS_PLACEHOLDER, coordsText)
            .replaceAll(SMS_LAT_PLACEHOLDER, lat)
            .replaceAll(SMS_LON_PLACEHOLDER, lon)
            .trim();

        const parts: string[] = [resolved];

        // Make it useful even if the receiver can't open Maps.
        if (!usesCoords) parts.push(`Coordenadas: ${coordsText}`);
        if (!usesMaps) parts.push(`Mapa: ${mapsUrl}`);

        return parts.join("\n").trim();
    };

    const buildSmsHref = (coords: { latitude: number; longitude: number }) => {
        const body = buildSmsBody(coords);
        return `sms:${smsRecipientNumber}?body=${encodeURIComponent(body)}`;
    };

    const checkLocation = () => {
        setGeoStatus('loading');
        if (!navigator.geolocation) {
            setGeoStatus('unsupported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const distance = getDistance(
                    { lat: latitude, lon: longitude },
                    { lat: centerPoint.lat, lon: centerPoint.lon }
                );

                if (distance <= radiusKm) {
                    setLocation({ latitude, longitude });
                    setGeoStatus('success');
                } else {
                    setGeoStatus('outside');
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setGeoStatus('denied');
                } else {
                    setGeoStatus('error');
                }
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    useEffect(() => {
       checkLocation();
    }, []);

    const handleSymptomClick = (isUrgent: boolean) => {
        setResult(isUrgent ? 'urgent' : 'non-urgent');
    };
    
    const restart = () => {
        setResult(null);
        checkLocation();
    }

    if (result) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Resultado de la Evaluación</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {result === 'urgent' && (
                            <>
                                <AlertTriangle className="w-16 h-16 mx-auto text-primary mb-4" />
                                <CardDescription className="text-lg mb-4">
                                    Parece ser una emergencia. Por favor, actúe de inmediato.
                                </CardDescription>
                                <div className="flex flex-col gap-4">
                                    <a href={`tel:${emergencyPhoneNumber}`} className="w-full">
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90"><Phone className="mr-2"/> Llamar Ambulancia ({emergencyPhoneNumber})</Button>
                                    </a>
                                    {location && (
                                     <a href={buildSmsHref(location)} className="w-full">
                                        <Button size="lg" variant="secondary" className="w-full"><MessageSquare className="mr-2"/> Compartir Ubicación por SMS</Button>
                                     </a>
                                    )}
                                </div>
                            </>
                        )}
                        {result === 'non-urgent' && (
                            <>
                                <Stethoscope className="w-16 h-16 mx-auto text-accent mb-4" />
                                <CardDescription className="text-lg mb-4">
                                    Parece que no es una urgencia. Le recomendamos:
                                </CardDescription>
                                <div className="flex flex-col gap-4">
                                    <a href={`https://wa.me/${whatsappTurnosNumber}`} target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button size="lg" variant="secondary" className="w-full"><MessageCircle className="mr-2"/>Pedir turno por WhatsApp</Button>
                                    </a>
                                    <Link href="/centros" passHref>
                                        <Button size="lg" variant="outline" className="w-full"><MapPin className="mr-2"/>Ver otros centros útiles</Button>
                                    </Link>
                                    <a href={`tel:${emergencyPhoneNumber}`} className="w-full">
                                        <Button size="lg" className="w-full"><Phone className="mr-2"/> Llamar Ambulancia ({emergencyPhoneNumber})</Button>
                                    </a>
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                         <Button variant="link" onClick={restart} className="w-full">Comenzar de nuevo</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="p-4 md:p-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-primary mb-2" />
              <h1 className="text-2xl font-bold mb-1">Auto Evaluación Rápida</h1>
              <p className="text-muted-foreground mb-6">Seleccioná la opción que mejor describe tu situación</p>
            </div>
            
            {geoStatus === 'loading' && (
                <div className="mb-4 text-center p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-blue-700">Verificando ubicación para optimizar la ayuda...</span>
                </div>
            )}
            
            {(geoStatus === 'denied' || geoStatus === 'error' || geoStatus === 'outside') && (
                <div className="mb-4 text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">No se pudo verificar la ubicación. Se usará el número de emergencia general ({fallbackAmbulanceNumber}).</p>
                    {geoStatus === 'outside' && <p className="text-xs text-yellow-700 mt-1">Estás fuera del área de cobertura local.</p>}
                </div>
            )}

            <div className="space-y-3 text-left">
                {allSymptoms.map((symptom, index) => (
                    <button
                        key={index}
                        onClick={() => handleSymptomClick(symptom.isUrgent)}
                        className={`w-full p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-200 border-l-4 ${symptom.isUrgent ? 'border-primary bg-card hover:bg-red-50/50' : 'border-gray-300 bg-card hover:bg-gray-50/50'}`}
                    >
                        <div className="flex items-center">
                            <span className={`font-bold mr-3 ${symptom.isUrgent ? 'text-primary' : 'text-blue-500'}`}>{index + 1}.</span>
                            <span className="font-medium">{symptom.text}</span>
                        </div>
                        {symptom.isUrgent && <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.28 3.23a.75.75 0 0 0-1.56 0l-.83 4.93a.75.75 0 0 0 .74.83h5.74a.75.75 0 0 0 .74-.83l-.83-4.93ZM5.47 9h13.06l-1.8 10.84a2.25 2.25 0 0 1-2.23 2.16H9.5a2.25 2.25 0 0 1-2.23-2.16L5.47 9Z"/><path d="M12 12v5"/><path d="M14.5 14.5h-5"/></svg>}
                    </button>
                ))}
            </div>
        </div>
    );
}
