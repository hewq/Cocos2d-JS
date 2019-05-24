let wxGame = {};

let shareTitle = '拉结尔';

wxGame.book = function () {
    wx.request({
        url: 'https://game.weixin.qq.com/cgi-bin/actnew/appletappointment',
        data: {
            cmd: 'make',
            noticeid: 123,
            device: 1,
            openid: localStorage.getItem('openid'),
            session_key: 123
        },
        success(res) {
            console.log(res)
        },
        fail (err) {
            console.error(err)
        }
    })
};

wxGame.getDevice = function () {
    wx.getSystemInfo({
        success(res) {
            if (res.platform === 'ios') {
                localStorage.setItem('device', 1);
            } else if (res.platform === 'android') {
                localStorage.setItem('device', 2);
            }
        }
    }) 
}

wxGame.auth = function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              
            }
          })
        }
      }
    })
};

wxGame.authSavePhoto = function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {}
          })
        }
      }
    })
};

wxGame.saveImage = function (filePath, cbS) {
    console.log('save image to photo album');
    wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: cbS
    })
};

wxGame.getUserInfo = function () {
    wx.getUserInfo({
      success (res) {
        const userInfo = res.userInfo
        localStorage.setItem('nickName', userInfo.nickName);
        localStorage.setItem('avatarUrl', userInfo.avatarUrl);
      }
    })
}

// 分享操作
wxGame.showShareMenu = function () {
    try {
        wx.showShareMenu({
            withShareTicket: true 
        });   
    } catch (e) {}
}

wxGame.onShareAppMessage = function () {
    try {
        wx.onShareAppMessage(function () {
            localStorage.setItem('closeTime', new Date().getTime());
            return {
                title: shareTitle
            }
        })
    } catch (e) {}
}

wxGame.onShow = function () {
    try {
        wx.onShow(function (res) {
            let curTime = new Date().getTime();
            if (curTime - localStorage.getItem('closeTime') >= 3000 && localStorage.getItem('sharing')) {
                if (localStorage.getItem('toPlayGame')) {
                    localStorage.setItem('afterShare', true);
                    localStorage.setItem('sharing', false);
                    cc.director.loadScene('game');
                }
            }
        });
    } catch (e) {}
}

wxGame.shareAppMessage = function () {
    localStorage.setItem('sharing', true);
    try {
        wx.shareAppMessage(function () {
            return {
                title: shareTitle
            }
        })
    } catch (e) {}
}

// 云函数操作
try {
    wx.cloud.init();  
} catch (e) {}

wxGame.getOpenId = function () {
    try {
        wx.cloud.callFunction({
          name: 'getUserInfo',
          success(res) {
            localStorage.setItem('openid', res.result.OPENID);
          },
          fail: console.error
        })
    } catch (e) {}
} 

wxGame.setUserCloudStorage = function (userKVData, cbS, cbF) {
    try {
        wx.setUserCloudStorage(
            {
                "KVDataList": [userKVData],
                success: cbS,
                fail: cbF
            }
        );
    } catch (e) {}
}

wxGame.getPlayTimes = function (cbS) {
    try {
        wx.cloud.callFunction({
            name: 'getPlayTimes',
            data: {
                openid: localStorage.getItem('openid')
            },
            success: cbS
        })
    } catch (e) {}
}

wxGame.updatePlayTimes = function (isFirst, tom, cbS) {
    try {
        wx.cloud.callFunction({
            name: 'updatePlayTimes',
            data: {
                openid: localStorage.getItem('openid'),
                isFirst: localStorage.getItem('isFirst'),
                tom: tom,
                date: new Date().getTime()
            },
            success: cbS
        })
    } catch (e) {}
}

wxGame.getScore = function (cbS) {
    try {
        wx.cloud.callFunction({
            name: 'getScore',
            data: {
                openid: localStorage.getItem('openid')
            },
            success: cbS
        })
    } catch (e) {}
}

wxGame.getScoreTotal = function (cbS) {
    try {
        wx.cloud.callFunction({
            name: 'getScore',
            data: {
                
            },
            success: cbS
        })
    } catch (e) {}
}

wxGame.updateScore = function (score, cbS, cbF) {
    try {
        wx.cloud.callFunction({
            name: 'updateScore',
            data: {
                openid: localStorage.getItem('openid'),
                nickName: localStorage.getItem('nickName'),
                avatarUrl: localStorage.getItem('avatarUrl'),
                score: score,
                hasScore: localStorage.getItem('hasScore')
            },
            success: cbS,
            fail: cbF
        })
    } catch (e) {}
}

module.exports = wxGame;

