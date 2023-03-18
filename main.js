const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const dashboard = $('.dashboard')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playlist = $('.playlist')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const currentTime = $('.runtime span:first-child')
const durationTime = $('.runtime span:last-child')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songsRepeat: [],

    songs: [
        {
            name: 'Blossoms of Summer Nnight',
            singer: 'HOYO-Mix',
            path: './assets/music/blossoms-of-summer-night.mp3',
            image: './assets/image/song-1.png'
        },
        {
            name: 'Letter from Ajax',
            singer: 'HOYO-Mix',
            path: './assets/music/letter-from-ajax.mp3',
            image: './assets/image/song-2.png'
        },
        {
            name: 'Path of Yaksha',
            singer: 'HOYO-Mix',
            path: './assets/music/path-of-yaksha.mp3',
            image: './assets/image/song-3.png'
        },
        {
            name: 'Blossoms of Summer Nnight 1',
            singer: 'HOYO-Mix',
            path: './assets/music/blossoms-of-summer-night.mp3',
            image: './assets/image/song-1.png'
        },
        {
            name: 'Letter from Ajax 1',
            singer: 'HOYO-Mix',
            path: './assets/music/letter-from-ajax.mp3',
            image: './assets/image/song-2.png'
        },
        {
            name: 'Path of Yaksha 1',
            singer: 'HOYO-Mix',
            path: './assets/music/path-of-yaksha.mp3',
            image: './assets/image/song-3.png'
        },
        {
            name: 'Blossoms of Summer Nnight 2',
            singer: 'HOYO-Mix',
            path: './assets/music/blossoms-of-summer-night.mp3',
            image: './assets/image/song-1.png'
        },
        {
            name: 'Letter from Ajax 2',
            singer: 'HOYO-Mix',
            path: './assets/music/letter-from-ajax.mp3',
            image: './assets/image/song-2.png'
        },
        {
            name: 'Path of Yaksha 2',
            singer: 'HOYO-Mix',
            path: './assets/music/path-of-yaksha.mp3',
            image: './assets/image/song-3.png'
        },
        {
            name: 'Blossoms of Summer Nnight 3',
            singer: 'HOYO-Mix',
            path: './assets/music/blossoms-of-summer-night.mp3',
            image: './assets/image/song-1.png'
        },
        {
            name: 'Letter from Ajax 3',
            singer: 'HOYO-Mix',
            path: './assets/music/letter-from-ajax.mp3',
            image: './assets/image/song-2.png'
        },
        {
            name: 'Path of Yaksha 3',
            singer: 'HOYO-Mix',
            path: './assets/music/path-of-yaksha.mp3',
            image: './assets/image/song-3.png'
        },
    ],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumpAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumpAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
        }

        playlist.onclick = function(e) {
            const songIndex = e.target.closest('.song:not(.active')
            const optionIndex = e.target.closest('.option')
            if(optionIndex) {
                console.log('OK')
            } else if(songIndex) {
                _this.currentIndex = Number(songIndex.dataset.index)

                _this.loadCurrentSong()
                _this.render()
                audio.play()
            }
        },

        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        prevBtn.onclick = function() {
            _this.prevSong()
            audio.play()
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        randomBtn.onclick = function() {
            if (_this.isRandom) {
                _this.isRandom = false
                randomBtn.classList.remove('active')
                
                _this.songsRepeat = []
                return _this.songsRepeat
            } else {
                _this.isRandom = true
                randomBtn.classList.add('active')      

                _this.songsRepeat = _this.songs.map((song, index) => index)
                return _this.songsRepeat
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumpAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumpAnimate.pause()
        }

        audio.onended = function() {
            switch(true) {
                case _this.isRepeat:
                    audio.play()
                    break
                case _this.isRandom:
                    _this.randomSong()
                default: 
                    nextBtn.click()
            }
        }

        audio.onloadedmetadata = function () {
            const durationMin = Math.floor(audio.duration / 60).toLocaleString().padStart(2, '0');
            const durationSec = Math.round(audio.duration % 60).toLocaleString().padStart(2, '0');
            durationTime.innerText = durationMin + ':' + durationSec
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 1000)
                progress.value = progressPercent
            }
            
            const currentMin = Math.floor(audio.currentTime / 60).toLocaleString().padStart(2, '0');
            const currentSec = Math.floor(audio.currentTime % 60).toLocaleString().padStart(2, '0');
            currentTime.innerText = currentMin + ':' + currentSec
        }

        progress.onchange = function(e) {
            const seekTime = e.target.value / 1000 * audio.duration
            audio.currentTime = seekTime
        }

        progress.oninput = function (e) {
            const seekTime = audio.duration / 1000 * e.target.value;
            audio.currentTime = seekTime;
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }

        this.activeSong()
        this.render()
        this.loadCurrentSong()
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.activeSong()
        this.render()
        this.loadCurrentSong()
    },

    randomSong: function() {
        let randomIndex, newIndex
        this.songsRepeat = this.songsRepeat.filter(song => song !== this.currentIndex)

        do {
            randomIndex = Math.floor(Math.random() * this.songsRepeat.length)
            newIndex = this.songsRepeat[randomIndex]
        } while(newIndex === this.currentIndex)

        if(this.songsRepeat.length <= 1) {
            this.songsRepeat = this.songs.map((song, index) => index)

            while(newIndex === this.currentIndex) {
                randomIndex = Math.floor(Math.random() * this.songsRepeat.length)
                newIndex = this.songsRepeat[randomIndex]
            }
        }
        this.currentIndex = newIndex
        
        this.activeSong()
        this.render()
        this.loadCurrentSong()
    },

    activeSong: function() {
        setTimeout(() => {           
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 200)
    },

    start: function() {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()

