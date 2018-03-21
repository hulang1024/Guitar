
/*
音高
*/
class Pitch {
  /*
  构造一个音高
  @param step 基本音级(1~7)
  @param octaves 八度数, 负数表示低, 正数表示高
  @param sharpFlat 升号还是降号(半音为单位,非重升降), 升=1,降=-1,无=0
  */
  constructor (step, octaves, sharpFlat = 0) {
    this.step = step;
    this.octaves = octaves;
    this.sharpFlat = sharpFlat;
  }

  /*
  加上半音
  @param halfToneNum 半音数量
  */
  addHalfTones (halfToneNum) {
    // 根据十二平均律计算包含的半音数
    var halfTones = Math.abs(this.octaves) * 12;
    var sumTable = [1, 3, 5, 6, 8, 10, 12];
    halfTones += sumTable[this.step - 1];
    // 加上升降号
    halfTones += this.sharpFlat;
    // 加上参数
    halfTones += halfToneNum;

    // 转换并创建一个新的音高
    var pitch = new Pitch();
    var modHalfTones = halfTones % 12;
    if (modHalfTones > 0) {
      for (var index = 0; index < 7; index++) {
        if (modHalfTones == sumTable[index]) {
          pitch.step = index + 1;
          pitch.sharpFlat = 0;
          break;
        } else if (modHalfTones > sumTable[index]) {
          if (modHalfTones < sumTable[index + 1]) {
            pitch.step = index + 1;
            pitch.sharpFlat = 1;
            break;
          }
        }
      }
    } else {
      pitch.step = 7;
      pitch.sharpFlat = 0;
    }

    pitch.octaves = Math.floor((this.octaves * 12
      + sumTable[this.step - 1] + halfToneNum - 1) / 12);

    return pitch;
  }

  /*
  @param nameType 1=唱名,2=音名,3=数字
  */
  toString (nameType) {
    var toneNames = {
      1: ['do', 're', 'mi', 'fa', 'so', 'la', 'si'],
      2: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      3: [1, 2, 3, 4, 5, 6, 7]
    };
    var str = '';
    if (this.sharpFlat) {
      str += (this.sharpFlat == 1 ? '#' : 'b');
      str += ' ';
    }
    if (this.octaves) {
      if (Math.abs(this.octaves) == 1) {
        //nothing
      } else if (Math.abs(this.octaves) == 2) {
        str += '倍';
      } else if (Math.abs(this.octaves) > 2) {
        str += Math.abs(this.octaves) + '倍';
      }
      str += (this.octaves > 0 ? '高' : '低') + '音';
    } else {
      str += '中音';
    }
    str += toneNames[nameType][this.step - 1];

    return '(' + str + ')';
  }
}

/*
指法位置
*/
class Position {
  /*
  @param stringNo 弦号(1~6)
  @param fret 第几品格
  */
  constructor (stringNo, fret = 0) {
    this.stringNo = stringNo;
    this.fret = fret;
  }
}

// 从最粗6~最细1弦各自的空弦音高
const stringPitchs = [
  new Pitch(3, -1), //低音3(E)
  new Pitch(6, -1), //低音6(A)
  new Pitch(2, 0),  //中音2(D)
  new Pitch(5, 0),  //中音5(G)
  new Pitch(7, 0),  //中音7(B)
  new Pitch(3, 1)   //高音3(E)
];

/* 将吉他指法位置转音高 */
function positionToPitch(position) {
  // 先得到空弦音高
  var pitch = stringPitchs[6 - position.stringNo];
  if (position.fret == 0)
    return pitch;
    // 将品格转换成半音数量并加上
  return pitch.addHalfTones(position.fret);
}
