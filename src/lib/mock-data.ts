export const PUBLIC_CARS = [
    {
        id: '1',
        name: 'Bentley Flying Spur',
        price: '358,174',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
        status: 'shipping' as const,
        specs: { year: '2022', fuel: 'Petrol', transmission: 'Auto', condition: 'Foreign Used' },
        description: "Experience the pinnacle of luxury with this 2022 Bentley Flying Spur. Featuring a handcrafted interior, powerful W12 engine, and advanced technology, this sedan offers an unmatched blend of performance and comfort."
    },
    {
        id: '2',
        name: 'Mercedes G63 AMG',
        price: '450,000',
        image: 'https://images.unsplash.com/photo-1520031441872-265149a4e69d?auto=format&fit=crop&q=80&w=800',
        status: 'shipping' as const,
        specs: { year: '2023', fuel: 'V8 Biturbo', transmission: 'Auto', condition: 'Brand New' },
        description: "Dominate the road with the legendary Mercedes-AMG G63. This iconic SUV combines rugged off-road capability with high-end luxury, boasting a 4.0L V8 biturbo engine that delivers breathtaking acceleration."
    },
    {
        id: '3',
        name: 'Audi R8 Green',
        price: '285,892',
        image: 'https://images.unsplash.com/photo-1603584173870-7b299f58927e?auto=format&fit=crop&q=80&w=800',
        status: 'arrived' as const,
        specs: { year: '2021', fuel: 'V10', transmission: 'Auto', condition: 'Foreign Used' },
        description: "Unleash your inner racer with this stunning Audi R8. With its naturally aspirated V10 engine and Quattro all-wheel drive, this supercar delivers precision handling and an exhilarating soundtrack."
    },
    {
        id: '4',
        name: 'Range Rover Autobiography',
        price: '195,000',
        image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=800',
        status: 'arrived' as const,
        specs: { year: '2023', fuel: 'Hybrid', transmission: 'Auto', condition: 'Brand New' },
        description: "The epitome of refined capability. This Range Rover Autobiography features a plug-in hybrid powertrain, offering silent EV cruising and formidable off-road prowess in supreme comfort."
    },
    {
        id: '5',
        name: 'Porsche 911 GT3',
        price: '320,500',
        image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800',
        status: 'shipping' as const,
        specs: { year: '2022', fuel: 'Petrol', transmission: 'PDK', condition: 'Foreign Used' },
        description: "Born for the track, ready for the road. The 911 GT3 offers pure driving connection with its high-revving flat-six engine, race-bred suspension, and lightning-fast PDK transmission."
    }
];
