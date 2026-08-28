export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method==='GET') return res.status(200).json({ok:true,service:'Hebrew Karaoke Studio Render API',version:'1.0',mode:'server'});
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  return res.status(501).json({ok:false,error:'Renderer worker is not installed on this runtime yet.','code':'FFMPEG_RUNTIME_REQUIRED'});
}