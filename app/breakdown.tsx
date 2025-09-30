import { useLocalSearchParams } from 'expo-router';

'use client';


export default function PlayerBreakdown() {
    const params = useLocalSearchParams();
    const { player_name, player_id } = params;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Player Breakdown</h1>
            <div className="space-y-2">
                <p><span className="font-semibold">Player:</span> {player_name}</p>
                <p><span className="font-semibold">ID:</span> {player_id}</p>
            </div>
        </div>
    );
}