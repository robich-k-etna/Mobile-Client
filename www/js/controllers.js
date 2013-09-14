var ShuntCtrl = function($scope) {
};

var DownloadsCtrl = function($scope) {
	// a recuperer du serveur
	var distant_data = [
        {
            id: 1,
            name: 'Lorem.Ipsum.zip',
            total_size: 200000,
            dl_size: 190000,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'SEED'
        },
        {
            id: 2,
            name: 'vacances_a_la_plage_2012.mov',
            total_size: 200000,
            dl_size: 66667,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'SEED'
        },
        {
            id: 3,
            name: 'VirtualBox-4.2.6-OSX.dmg',
            total_size: 200000,
            dl_size: 100000,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'PAUSE'
        },
        {
            id: 4,
            name: 'Mon.Super.DL.rar',
            total_size: 200000,
            dl_size: 18000,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'ERROR'
        },
        {
            id: 5,
            name: 'Lorem.Ipsum.zip',
            total_size: 200000,
            dl_size: 190000,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'SEED'
        },
        {
            id: 6,
            name: 'vacances_a_la_plage_2012.mov',
            total_size: 200000,
            dl_size: 66667,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'SEED'
        },
        {
            id: 7,
            name: 'VirtualBox-4.2.6-OSX.dmg',
            total_size: 200000,
            dl_size: 100000,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'PAUSE'
        },
        {
            id: 8,
            name: 'Mon.Super.DL.rar',
            total_size: 200000,
            dl_size: 18000,
            dl_rate: 0,
            added_date: 1371333730,
            'status': 'ERROR'
        }
    ];

    $scope.view_part = 'list';
    $scope.action = '';
    $scope.current_file = {};
    $scope.filter = {};

    $scope.fileDetails = function(file) {
        $scope.action = 'details';
        $scope.current_file = file;
        $scope.view_part = 'details';
    };
    $scope.fileList = function() {
        $scope.view_part = 'list';
    };

    $scope.refreshInfos = function() {
        $scope.infos = {};
        for (var i = 0; i < distant_data.length; ++i) {
            var file = distant_data[i];
            file.progress = ~~(file.dl_size / file.total_size * 100)
        }
        $scope.infos.files = angular.copy(distant_data);
    };
    $scope.refreshInfos();
};

var ConfigCtrl = function($scope) {
    $scope.view_part = 'list';
    $scope.action = '';
    $scope.current_server = null;
    $scope.servers = [];

    $scope.loadServers = function() {
        var json = window.localStorage.getItem('servers');
        try {
            $scope.servers = JSON.parse(json);
        }
        catch(e) {
            $scope.servers = [];
        }
        if (!$scope.servers)
            $scope.servers = [];
    };
    $scope.saveServers = function() {
        window.localStorage.setItem('servers', JSON.stringify($scope.servers));
    };
    $scope.loadServers();

    $scope.addServer = function() {
        $scope.action = 'add';
        $scope.current_server = {};
        $scope.view_part = 'form';
    };
    $scope.editServer = function(server) {
        $scope.action = 'edit';
        $scope.original_server = angular.copy(server);
        $scope.current_server = server;
        $scope.view_part = 'form';
    };
    $scope.saveServer = function() {
        if ($scope.action == 'add')
            $scope.servers.push($scope.current_server);
        $scope.saveServers();
        $scope.view_part = 'list';
    };
    $scope.deleteServer = function(index) {
        $scope.servers.splice(index, 1);
        $scope.saveServers();
    };
    $scope.cancelEdit = function() {
        if ($scope.action == 'edit')
            angular.extend($scope.current_server, $scope.original_server);
        $scope.view_part = 'list';
    };
};

angular
.module('shunt.controllers', [])
.controller('ShuntCtrl', ['$scope', ShuntCtrl])
.controller('DownloadsCtrl', ['$scope', DownloadsCtrl])
.controller('ConfigCtrl', ['$scope', ConfigCtrl])
