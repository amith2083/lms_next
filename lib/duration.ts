 export const formatDuration = (duration:number):string|null => {
    if (!duration) return null;

    const hour = Math.floor(duration / 3600);
    const min = Math.floor(duration % 3600 / 60);
    const sec = Math.floor(duration % 3600 % 60);

    const durationString = `${hour}:${min}:${sec}`;
    return durationString; 
    
  }