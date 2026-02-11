export interface PokemonData {
  id: number;
  name: string;
}

export interface TestConfig {
  environment: 'qa' | 'cert';
  secretKey: string;
}
