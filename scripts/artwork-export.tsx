import {Composition, registerRoot} from 'remotion';
import {Artwork} from '../src/visual/LayeredCharacter';
import {provisionalAppearance} from '../src/visual/provisionalArtwork';
const art=provisionalAppearance('ren',false);
const ExportLayer=({id}:{id:string})=>{
  const layer=art.layers.find(v=>v.id===id)!;
  return <svg width="100%" height="100%" viewBox={`0 0 ${layer.size.join(' ')}`}>
    <Artwork source={layer.source} layer={{offset:[0,0],size:layer.size}}/>
  </svg>;
};
registerRoot(()=><>
  <Composition id="ExportEye" component={ExportLayer} width={144} height={144} fps={30} durationInFrames={1} defaultProps={{id:'eye-white-L'}}/>
  <Composition id="ExportHair" component={ExportLayer} width={704} height={576} fps={30} durationInFrames={1} defaultProps={{id:'front-hair'}}/>
</>);
