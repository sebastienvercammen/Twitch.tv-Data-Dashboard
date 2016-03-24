(function() {
	var socket = io('http://sebastienvercammen.be:17757');
	
	function countArrInDataObj(obj) {
		var count = 0;
		
		for(var e in obj) {
			if(obj.hasOwnProperty(e)) {
				var arr = obj[e];
				
				for(var i = 0; i < arr.length; i++) {
					count++;
				}
			}
		}
		
		return count;
	}
	
	function millisecondsToDays(t) {
		var cd = 24 * 60 * 60 * 1000,
			ch = 60 * 60 * 1000,
			d = Math.floor(t / cd),
			h = Math.floor( (t - d * cd) / ch),
			m = Math.round( (t - d * cd - h * ch) / 60000),
			pad = function(n){ return n < 10 ? '0' + n : n; };
		
		if( m === 60 ){
			h++;
			m = 0;
		}
		
		if( h === 24 ){
			d++;
			h = 0;
		}
		
		return d + ' days, ' + h + ' hours, ' + m + ' minutes';
	}
	
	function updateAllChannelCounters(msgsPerMinute) {
		var els = document.getElementsByClassName('channel-row');
		
		for(var i = 0; i < els.length; i++) {
			var channel = els[i].getElementsByClassName('channel')[0].textContent;
			var elCount = els[i].getElementsByClassName('count')[0];
			
			if(msgsPerMinute.hasOwnProperty(channel)) {
				elCount.textContent = msgsPerMinute[channel].length;
			} else {
				elCount.textContent = 0;
			}
		}
	}
	
	socket.on('stats', function(data) {
		var uptime = millisecondsToDays(data.uptime);
		var emotesPerMinute = data.stats.emoteCountPerMinute;
		var chanMsgsPerMinute = data.stats.chanMsgsPerMinute;
		
		// Count total emotes used
		var countEmotesPerMinute = countArrInDataObj(emotesPerMinute);
		var countTotalMsgsPerMinute = countArrInDataObj(chanMsgsPerMinute);
		
		// Set counters
		document.getElementById('uptime').textContent = uptime;
		document.getElementById('emotes-per-minute').textContent = countEmotesPerMinute;
		document.getElementById('msgs-per-minute').textContent = countTotalMsgsPerMinute;
		
		// Update all channels
		updateAllChannelCounters(chanMsgsPerMinute);
	});
	
	socket.on('channels', function(data) {
		data.sort();
		
		var table = document.getElementById('channels').getElementsByTagName('tbody')[0];
		
		for(var i = 0; i < data.length; i++) {
			var row = table.insertRow(-1);
			row.className = 'channel-row';
			
			// Striped?
			if((i + 1) % 2 !== 0) {
				row.className += ' pure-table-odd';
			}
			
			var cellId = row.insertCell(-1);
			cellId.className = 'id';
			
			var cellChannel = row.insertCell(-1);
			cellChannel.className = 'channel';
			
			var cellCountMsgs = row.insertCell(-1);
			cellCountMsgs.className = 'count';
			
			var cellLink = row.insertCell(-1);
			cellLink.className = 'link';
			
			cellId.textContent = (i + 1);
			cellChannel.textContent = data[i];
			cellCountMsgs.textContent = 0;
			cellLink.innerHTML = '<a href="http://twitch.tv/' + data[i].substr(1) + '" rel="nofollow"><i class="fa fa-twitch"></a>';
		}
	});
})();