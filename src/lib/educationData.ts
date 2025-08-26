import { Heart, Baby, Wind, Brain, Droplet, Flame, BriefcaseMedical, UserMinus } from 'lucide-react';

export const educationData = [
  {
    slug: 'rcp-adultos',
    title: 'RCP ADULTOS',
    shortTitle: 'RCP ADULTOS',
    subtitle: 'Técnicas de reanimación para adultos',
    description: `
1. **Verificar seguridad:** Asegúrese de que el lugar sea seguro para usted y la víctima.
2. **Evaluar respuesta:** Toque los hombros de la víctima y pregunte en voz alta: "¿Estás bien?".
3. **Llamar a emergencias:** Si no responde, llame al 107 (Ambulancia) o pida a alguien que lo haga.
4. **Abrir vía aérea:** Incline suavemente la cabeza hacia atrás y levante el mentón.
5. **Verificar respiración:** Observe si el pecho se eleva durante no más de 10 segundos.
6. **Iniciar compresiones:** Coloque el talón de una mano en el centro del pecho y la otra mano encima. Realice 30 compresiones fuertes y rápidas (a un ritmo de 100-120 por minuto).
7. **Ventilaciones (opcional):** Si está entrenado, dé 2 ventilaciones después de las 30 compresiones.
8. **Continuar:** Siga con ciclos de 30 compresiones hasta que llegue la ayuda.`,
    videoUrl: 'https://example.com/rcp-adultos',
    icon: Heart,
    color: 'bg-neutral-200/50',
    iconColor: 'text-neutral-400',
  },
  {
    slug: 'rcp-ninos',
    title: 'RCP NIÑOS',
    shortTitle: 'RCP NIÑOS',
    subtitle: 'Técnicas específicas de RCP para niños y bebés',
    description: `
1. **Verificar respuesta y respiración.**
2. **Llamar a emergencias (107).**
3. **En bebés: usar 2 dedos en el centro del pecho.**
4. **En niños: usar una o dos manos según el tamaño.**
5. **Comprimir 30 veces (4 cm en bebés, 5 cm en niños).**
6. **Dar 2 respiraciones suaves cubriendo boca y nariz.**
7. **Continuar ciclos 30:2.**`,
    videoUrl: 'https://example.com/rcp-ninos',
    icon: Baby,
    color: 'bg-cyan-400',
    iconColor: 'text-white',
  },
   {
    slug: 'atragantamiento',
    title: 'ATRAGANTAMIENTO (MANIOBRA DE HEIMLICH)',
    shortTitle: 'ATRAGANTAMIENTO',
    subtitle: 'Cómo actuar ante un atragantamiento',
    description: `
1. **Anime a toser:** Si la persona puede toser, anímela a que siga haciéndolo.
2. **Pida ayuda:** Llame a emergencias si la persona no puede respirar, toser o hablar.
3. **Dé 5 golpes en la espalda:** Incline a la persona hacia adelante y dé 5 golpes firmes entre los omóplatos con el talón de su mano.
4. **Realice 5 compresiones abdominales (Maniobra de Heimlich):** Párese detrás de la persona, rodee su cintura con sus brazos, cierre un puño por encima del ombligo y presione bruscamente hacia adentro y hacia arriba.
5. **Alterne:** Continúe alternando 5 golpes en la espalda y 5 compresiones abdominales hasta que el objeto sea expulsado o llegue la ayuda.`,
    videoUrl: 'https://example.com/heimlich',
    icon: Wind,
    color: 'bg-neutral-200/50',
    iconColor: 'text-neutral-400',
  },
  {
    slug: 'convulsiones',
    title: 'CONVULSIONES',
    shortTitle: 'CONVULSIONES',
    subtitle: 'Qué hacer durante una convulsión',
    description: `
1. **Mantenga la calma y proteja a la persona:** Aleje objetos peligrosos y coloque algo suave bajo su cabeza. Gírela de lado.
2. **NO intente sujetar a la persona** ni ponga nada en su boca.
3. **Cronometre la convulsión:** Es información útil para el personal médico.
4. **Llame a emergencias si:** Dura más de 5 minutos, la persona tiene dificultad para respirar, ocurre en el agua o es su primera convulsión.`,
    videoUrl: 'https://example.com/convulsiones',
    icon: Brain,
    color: 'bg-green-500',
    iconColor: 'text-white',
  },
  {
    slug: 'control-hemorragias',
    title: 'CONTROL DE HEMORRAGIAS',
    shortTitle: 'CONTROL DE HEMORRAGIAS',
    subtitle: 'Cómo detener un sangrado',
    description: `
1. **Aplique presión directa:** Use un paño limpio o un vendaje y presione firmemente sobre la herida.
2. **Eleve la extremidad:** Si la herida está en un brazo o una pierna, elévela por encima del nivel del corazón.
3. **No retire el vendaje:** Si la sangre empapa el vendaje, no lo quite. Coloque otro encima y siga aplicando presión.
4. **Llame a emergencias:** Si el sangrado es severo o no se detiene.`,
    videoUrl: 'https://example.com/hemorragias',
    icon: Droplet,
    color: 'bg-neutral-200/50',
    iconColor: 'text-neutral-400',
  },
  {
    slug: 'quemaduras',
    title: 'QUEMADURAS',
    shortTitle: 'QUEMADURAS',
    subtitle: 'Primeros auxilios para quemaduras',
    description: `
1. **Enfríe la quemadura:** Ponga la zona bajo agua corriente fría (no helada) durante 10-15 minutos.
2. **Cubra la quemadura:** Use un vendaje estéril y antiadherente.
3. **NO use hielo,** no reviente las ampollas, ni aplique remedios caseros.
4. **Busque atención médica:** Para quemaduras graves, grandes, o en zonas sensibles (cara, manos, etc.).`,
    videoUrl: 'https://example.com/quemaduras',
    icon: Flame,
    color: 'bg-orange-400',
    iconColor: 'text-white',
  },
  {
    slug: 'botiquin-basico',
    title: 'BOTIQUIN BASICO',
    shortTitle: 'BOTIQUIN BASICO',
    subtitle: 'Elementos esenciales de primeros auxilios',
    description: `Un buen botiquín de primeros auxilios debe contener:
1. **Vendas** de diferentes tamaños.
2. **Gasas** estériles.
3. **Cinta** adhesiva médica.
4. **Toallitas** antisépticas.
5. **Tijeras** y **Pinzas**.
6. **Guantes** desechables.
7. **Analgésicos** y **Antihistamínicos**.
8. **Termómetro.**`,
    videoUrl: 'https://example.com/botiquin',
    icon: BriefcaseMedical,
    color: 'bg-blue-500',
    iconColor: 'text-white',
  },
  {
    slug: 'hipotension-desmayo',
    title: 'HIPOTENSION / DESMAYO',
    shortTitle: 'HIPOTENSION / DESMAYO',
    subtitle: 'Cómo asistir a alguien que se desmaya',
    description: `
1. **Si se siente mareado:** Acuéstelo y eleve sus piernas.
2. **Si ya se desmayó:** Colóquelo de lado (posición de recuperación).
3. **Verifique la respiración:** Asegúrese de que respira con normalidad.
4. **Llame a emergencias:** Si no recupera la conciencia en un minuto.`,
    videoUrl: 'https://example.com/desmayo',
    icon: UserMinus,
    color: 'bg-neutral-200/50',
    iconColor: 'text-neutral-400',
  },
];
