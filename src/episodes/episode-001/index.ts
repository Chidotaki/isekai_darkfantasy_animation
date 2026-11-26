import {defineEpisode} from '../../production/EpisodeComposition';
import type {AnimationRegistry} from '../../production/episodeTypes';
import {episode001S001Manifest} from './manifest';
import {S001Shot001} from './shots/S001Shot001';
import {S001Shot002} from './shots/S001Shot002';
import {S001Shot003} from './shots/S001Shot003';
import {S001Shot004} from './shots/S001Shot004';

export const s001Animations: AnimationRegistry = {
  's001-sh001': S001Shot001,
  's001-sh002': S001Shot002,
  's001-sh003': S001Shot003,
  's001-sh004': S001Shot004,
};

export const episode001S001 = defineEpisode(episode001S001Manifest, s001Animations);
