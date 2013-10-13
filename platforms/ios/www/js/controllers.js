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
    $scope.saveServers = function() {
        window.localStorage.setItem('servers', JSON.stringify($scope.servers));
    };
};

var DownloadsCtrl = function($scope, requestService) {
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
        $scope.current_file = {};
        $scope.action = 'add';
        $scope.view_part = 'add';
    };
    $scope.addFile = function() {
        requestService.request('POST', '/torrents', {torrent: $scope.current_file.link}, function(data) {
            $scope.fileList();
            $scope.refreshInfos();
        });
    };
    $scope.startFile = function(file) {
        requestService.request('GET', '/torrents/' + file.id + '/start', {}, function(data) {
            $scope.refreshInfos();
        });
    };
    $scope.stopFile = function(file) {
        requestService.request('GET', '/torrents/' + file.id + '/stop', {}, function(data) {
            $scope.refreshInfos();
        });
    };
    $scope.deleteFile = function(file) {
        requestService.request('DELETE', '/torrents/' + file.id, {}, function(data) {
            $scope.refreshInfos();
        });
    };

    $scope.refreshInfos = function() {
        $scope.infos = {dlspeed: 0, dltotal: 0};
        if ($scope.current_server) {
            requestService.request('GET', '/torrents', {}, function(data) {
                for (var i = 0; i < data.length; ++i) {
                    var file = data[i];
                    if (file.dl_size > file.total_size)
                        file.dl_size = file.total_size;
                    if (file.dl_size < file.total_size && file.status == 'STOPPED')
                        file.status = 'PAUSED';
                    $scope.infos.dlspeed += file.dl_rate;
                    $scope.infos.dltotal += file.dl_size;
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
                $scope.servers.move(i, 0);
                $scope.saveServers();
                $scope.current_server = $scope.servers[0];
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
