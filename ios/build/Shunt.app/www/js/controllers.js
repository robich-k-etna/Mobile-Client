function DownloadsCtrl($scope) {
	// a recuperer du serveur
	var distant_data = {
    	dlspeed: 290,
    	ulspeed: 110,
    	dltotal: 580.82,
    	ultotal: 222.11,
    	files: [
    		{
    			title: 'Lorem.Ipsum.zip',
    			total: 200000,
    			downloaded: 190000,
    		},
    		{
    			title: 'vacances_a_la_plage_2012.mov',
    			total: 200000,
    			downloaded: 66667
    		},
    		{
    			title: 'VirtualBox-4.2.6-OSX.dmg',
    			total: 200000,
    			downloaded: 100000,
    			paused: 1
    		},
    		{
    			title: 'Mon.Super.DL.rar',
    			total: 200000,
    			downloaded: 18000,
    			error: 1
    		},
    		{
    			title: 'Lorem.Ipsum.zip',
    			total: 200000,
    			downloaded: 190000,
    		},
    		{
    			title: 'vacances_a_la_plage_2012.mov',
    			total: 200000,
    			downloaded: 66667
    		},
    		{
    			title: 'VirtualBox-4.2.6-OSX.dmg',
    			total: 200000,
    			downloaded: 100000,
    			paused: 1
    		},
    		{
    			title: 'Mon.Super.DL.rar',
    			total: 200000,
    			downloaded: 18000,
    			error: 1
    		}
    	]
	}

    var local_data = {
    	dlspeed: distant_data.dlspeed,
    	ulspeed: distant_data.ulspeed,
    	dltotal: distant_data.dltotal,
    	ultotal: distant_data.ultotal,
    	files: []
    };

	for (var i = distant_data.files.length; i--;)
	{
		var file_data = distant_data.files[i];
		var file = {
			title: file_data.title,
			progress: ~~(file_data.downloaded / file_data.total * 100),
			status_class: '',
			icon_class: 'refresh'
		};
		if (file_data.paused)
		{
			file.status_class = 'pause';
			file.icon_class = 'pause';
		}
		if (file_data.error)
		{
			file.status_class = 'error';
			file.icon_class = 'minus-sign';
		}
		local_data.files.push(file);
	}

	$scope.infos = local_data;
}

function ConfigCtrl($scope) {
    //TODO
}
