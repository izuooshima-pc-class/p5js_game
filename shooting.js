let hp_base = 150
let jiki={x:200,y:320,hp:100,size:24}
let obake={x:200,y:100,buf_x:0,hp:hp_base,size:60,mode:0}
let tama=[]
let tekitama = []
let fire = 0
let start = 100
let count = 0
let state = "game"

function setup() {
  createCanvas(400, 400);
}
 
function draw() {
  background(220);
  
  if(state=="gameover"){
    gameover()
    return
  } else if(state=="win"){
    win()
    return
  }
  fill(255)
  count += 1
  jiki_move()
  circle(jiki.x-jiki.size/2,jiki.y-jiki.size/2,jiki.size)
  teki_move()
  textSize(obake.size)
  text("👻",obake.x-obake.size/2,obake.y-obake.size/2)
  attack()

  fire -= 1
  tama = tama.filter(t=>t.y>0)

  if(obake.mode==0){
    fill(0,0,255)
  } else if(obake.mode==1){
    fill(0,255,0)
  } else if(obake.mode==2){
    fill(255,0,0)
  } 
  rect(10,10,obake.hp,10)
  fill(0,255,0)
  rect(290,380,jiki.hp,10)
  textSize(20)
  fill(0)
  text(count,350,25)
  
}
function jiki_move(){
  if (keyIsDown(LEFT_ARROW)) {
    jiki.x -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    jiki.x += 5;
  }
  if (keyIsDown(UP_ARROW)) {
    jiki.y -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    jiki.y += 5;
  }
  if(keyIsDown(32) && fire<0){
    tama.push({x:jiki.x-jiki.size/2,y:jiki.y-jiki.size/2})
    fire = 10
  }
}
function teki_move(){
  if(Math.abs(obake.buf_x)<3){
    let d = (Math.floor(Math.random()*3)+1)*40+80
    if(obake.x>=200){
      obake.buf_x = d
    } else {
      obake.buf_x = d*(-1)
    }
  }
  if(obake.buf_x>0){
    obake.x -= 3
    obake.buf_x -= 3
  } else if(obake.buf_x<0){
    obake.x += 3
    obake.buf_x += 3
  }
  let tobj={x:obake.x+obake.size/2,y:obake.y}
  if(count>180){
    if(obake.mode==0){
      if(count%30==0){
        tobj.size=10
        tobj.sp=3
        tobj = follow(tobj)
        tekitama.push(tobj)
      } else if(count%20==10){
        tobj.size=10
        tobj.sp=3
        tobj = straight(tobj)
        tekitama.push(tobj)
      }
    } else if(obake.mode==1){
      if(count%20==0){
        tobj.size=30
        tobj.sp=3
        tobj = follow(tobj)
        tekitama.push(tobj)
      }
    } else if(obake.mode==2){
      if(count%15==0){
        let tobj2={}
        tobj2.x=start
        tobj2.y=0
        tobj2.size=30
        tobj2.sp=4
        tobj2 = straight(tobj2)
        tekitama.push(tobj2)
      }
      if(count%30==0){
        let tobj2={}
        tobj2.x=tobj.x
        tobj2.y=tobj.y
        tobj2.size=10
        tobj2.sp=3
        tobj2 = follow(tobj2)
        tekitama.push(tobj2)
      }
      if(count%60==0){
        start += 50
        if(start>300){start = 100}
      }
    }
  }
  let half = jiki.size/2
  tekitama.forEach(t=>{
    t.y += t.sp
    t.x += (t.dx/t.dy)*t.sp
    fill(255)
    circle(t.x-t.size/2,t.y-t.size/2,t.size)
    if(Math.abs(t.x+t.size/2-jiki.x-half)<half && Math.abs(t.y+t.size/2-jiki.y-half)<half){
      jiki.hp -= 1
      if(jiki.hp<=0){
        state = "gameover"
      }
      fill(255,0,0)
      circle(jiki.x-jiki.size/2,jiki.y-jiki.size/2,jiki.size)
    }
  }) 
}


function attack(){
  let half = obake.size/2
  tama.forEach(t=>{
    t.y-=5
    fill(255)
    circle(t.x,t.y,10)
    if(Math.abs(t.x+5-obake.x-half)<half && Math.abs(t.y+5-obake.y-half)<half){
      obake.hp -= 1
      textSize(30)
      fill(0)
      text("hit!",20,50)
    }
    if(obake.hp<=0){
      if(obake.mode==2){
        state = "win"
      } else {
        obake.mode+=1
        obake.hp = hp_base
      }
    }
  })
}
function follow(tama){
  tama.dx = jiki.x+jiki.size/2-obake.x-obake.size/2
  tama.dy = jiki.y+jiki.size/2-obake.y-obake.size/2
  return tama
}
function straight(tama){
  tama.dx = 0
  tama.dy = 1
  return tama
}
function win(){
  fill(0)
  textSize(30)
  text("GAME CLEAR!!",90,80)
  textSize(20)
  text("Time: "+count,140,130)
}
function gameover(){
  fill(0)
  textSize(30)
  text("GAME OVER",100,80)
}
    
