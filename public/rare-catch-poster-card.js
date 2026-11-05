/* Show the lightweight original Rare Catch poster; no animated 2.0 media. */
(()=>{
 fetch('/rare-catch-poster.avif.base64')
  .then(r=>{if(!r.ok)throw Error('Rare Catch art not found');return r.text()})
  .then(data=>{
    const b64=data.trim();
    if(!/^[A-Za-z0-9+/]+={0,2}$/.test(b64))return;
    const url='data:image/avif;base64,'+b64;
    document.querySelectorAll('.mode-catch').forEach(card=>card.style.setProperty('--rare-poster','url("'+url+'")'));
  })
  .catch(()=>{});
})();
