import * as migration_20250819_173703_add_initial_tables from './20250819_173703_add_initial_tables';

export const migrations = [
  {
    up: migration_20250819_173703_add_initial_tables.up,
    down: migration_20250819_173703_add_initial_tables.down,
    name: '20250819_173703_add_initial_tables'
  },
];
