let cell=[
  {x:3,y:3,color:0},{x:4,y:3,color:1},{x:3,y:4,color:1},{x:4,y:4,color:0}]
let bw = 0
let get_memo=[]
let count = 0
let winner = -1
let num0 = 0
let num1 = 0

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  strokeWeight(2);
  if(winner!=-1){
    drawResult() //ゲーム結果表示
  } else {
    fill(color(bw*255))
    circle(52,312,25)
    textSize(20)
    fill(0)
    text("の番です",70,320)
  }
  draw_cell() //石の表示
  for(let i=0;i<9;i++){ //枠線の表示
    line(50,30+30*i,290,30+30*i)
    line(50+30*i,30,50+30*i,270)
  }
  if(count>0){
    fill(0)
    textSize(15)
    text("そこには置けません",200,320)
    count -= 1
  }
}

function draw_cell(){ //石の表示
  cell.forEach(function(e){
    fill(color(e.color*255))
    circle(65+30*e.x,45+30*e.y,25)
  })
  
}

function mousePressed(){
  if(winner!=-1) return false
  let mx = Math.floor((mouseX-50)/30)
  let my = Math.floor((mouseY-30)/30)
  if(!checkPlace(mx,my,bw)){ //石を置けない場所をクリックした時
    count = 30
    return false
  }
  get_memo.forEach(c=>{ //石をひっくり返す
    c.color=1-c.color
  })
  get_memo = []
  cell.push({"x":mx,"y":my,"color":bw}) //石を追加
  bw = 1 - bw
  num0 = cell.filter(c=>c.color==0).length //黒の石の数を更新
  num1 = cell.filter(c=>c.color==1).length //白の石の数を更新
  checkPass() //パスが発生するかチェック
  if(cell.length==64){ //ゲーム終了チェック
    if(num0>num1){
      winner=0
    } else if(num1>num0){
      winner=1
    } else {
      winner=2
    }
  }
}

function checkPlace(mx,my,bw){ //石が置けるかをチェック
  if(mx > 7 || my > 7 || mx < 0 || my < 0){ //枠外
    return false
  }
  if(cell.find(c => c.x==mx && c.y==my)){ //既に石が置いてある場合
    return false
  }
  for(let i=0;i<8;i++){ //8方向に石があるかチェック
    checkDirection(mx,my,i)
  }
  if(get_memo.length>0){ //ひっくり返せる石があればそこに石を置けるのでOK
    return true
  }
}
function checkDirection(mx,my,i){ //8方向に石があるかチェック
  const d = [
    [1,0],[1,-1],[0,-1],[-1,-1],
    [-1,0],[-1,1],[0,1],[1,1]
  ]
  let r = ""
  const dx = mx+d[i][0]
  const dy = my+d[i][1]
  const ncell = cell.find(c=>c.x==dx&&c.y==dy) //指定された方向にある石
  if(ncell && ncell.color!=bw){
    ncell.d=i
    get_memo.push(ncell) //相手の石ならひっくり返す候補になる
    checkDirection(dx,dy,i) //自分を呼び出す
  } else if(!ncell){
    get_memo=get_memo.filter(c=>c.d!=i) //自分の石が無ければひっくり返す候補を消す
  }
}
function checkPass(){ //置ける場所が無ければパス
  let c = 0
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(checkPlace(i,j,bw)){
        c += 1
      }
    }
  }
  if(c==0){
    bw = 1-bw
  }
}
function drawResult(){ //ゲーム結果表示
  textSize(30)
  fill(0)
  if(winner!=2){
    text("の勝利!",70,320)
    fill(color(winner*255))
    circle(52,310,25)
  } else {
    text("引き分け!",40,320)
  }
  textSize(20)
  fill(0)
  circle(200,310,25)
  text(num0,220,315)
  text(num1,220,355)  
  fill(255)
  circle(200,350,25)

}
