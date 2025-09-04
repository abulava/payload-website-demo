import * as migration_20250819_173703_add_initial_tables from './20250819_173703_add_initial_tables';
import * as migration_20250826_085849_drop_autosave_from_posts from './20250826_085849_drop_autosave_from_posts';
import * as migration_20250826_122833_drop_autosave_from_pages from './20250826_122833_drop_autosave_from_pages';
import * as migration_20250904_072706_drop_payload_jobs from './20250904_072706_drop_payload_jobs';

export const migrations = [
  {
    up: migration_20250819_173703_add_initial_tables.up,
    down: migration_20250819_173703_add_initial_tables.down,
    name: '20250819_173703_add_initial_tables',
  },
  {
    up: migration_20250826_085849_drop_autosave_from_posts.up,
    down: migration_20250826_085849_drop_autosave_from_posts.down,
    name: '20250826_085849_drop_autosave_from_posts',
  },
  {
    up: migration_20250826_122833_drop_autosave_from_pages.up,
    down: migration_20250826_122833_drop_autosave_from_pages.down,
    name: '20250826_122833_drop_autosave_from_pages',
  },
  {
    up: migration_20250904_072706_drop_payload_jobs.up,
    down: migration_20250904_072706_drop_payload_jobs.down,
    name: '20250904_072706_drop_payload_jobs'
  },
];
