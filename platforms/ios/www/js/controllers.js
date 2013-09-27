var ShuntCtrl = function($scope) {
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
};

var DownloadsCtrl = function($scope, requestService) {
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
    $scope.current_server = null;
    $scope.server_filter = null;

    $scope.fileDetails = function(file) {
        $scope.action = 'details';
        $scope.current_file = file;
        $scope.view_part = 'details';
    };
    $scope.fileList = function() {
        $scope.current_file = {};
        $scope.view_part = 'list';
    };
    $scope.addPart = function() {
        $scope.action = 'add';
        $scope.view_part = 'add';
    };
    $scope.addFile = function() {
        requestService.request('POST', '/torrents', {torrent: $scope.current_file.link}, function(data) {
            $scope.fileList();
            $scope.refreshInfos();
        });
    };

    $scope.refreshInfos = function() {
        $scope.infos = {};
        if ($scope.current_server) {
            requestService.request('GET', '/torrents', {}, function(data) {
                for (var i = 0; i < data.length; ++i) {
                    var file = data[i];
                    if (file.dl_size > file.total_size)
                        file.dl_size = file.total_size;
                    if (file.dl_size < file.total_size && file.status == 'STOPPED')
                        file.status = 'PAUSED';
                    file.progress = ~~(file.dl_size / file.total_size * 100);
                }
                $scope.infos.files = angular.copy(data);
            });
        }
    };
    $scope.loadServers();
    if ($scope.servers.length) {
        $scope.server_filter = $scope.servers[0].name;
    }

    $scope.$watch('server_filter', function(value) {
        for (var i = 0; i < $scope.servers.length; ++i) {
            if ($scope.servers[i].name == value) {
                $scope.current_server = $scope.servers[i];
                requestService.setServer($scope.current_server.address, $scope.current_server.port);
                requestService.setBasicAuth($scope.current_server.login, $scope.current_server.password);
                $scope.refreshInfos();
                return;
            }
        }
        $scope.current_server = null;
        requestService.noBasicAuth($scope.current_server.login, $scope.current_server.password);
        $scope.refreshInfos();
    });
};

var ConfigCtrl = function($scope) {
    $scope.view_part = 'list';
    $scope.action = '';
    $scope.current_server = null;

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
.controller('DownloadsCtrl', ['$scope', 'requestService', DownloadsCtrl])
.controller('ConfigCtrl', ['$scope', ConfigCtrl])
