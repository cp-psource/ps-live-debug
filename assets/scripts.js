( function( $ ) {
	var safetyPopup            = $( '#safety-popup' ),
		acceptRisk             = $( '#riskaccept' ),
		acceptRiskData         = { 'action': 'ps-live-debug-accept-risk' },
		responseHolder         = $( '#wp-debug-response-holder' ),
		refreshToggle          = $( '#toggle-auto-refresh' ),
		debugArea              = $( '#ps-live-debug-area' ),
		refreshData            = { 'action': 'ps-live-debug-read-log' },
		clearButton            = $( '#ps-live-debug-clear' ),
		deleteButton           = $( '#ps-live-debug-delete' ),
		backupButton           = $( '#ps-live-debug-backup' ),
		createBackupData       = { 'action': 'ps-live-debug-create-backup' },
		restoreButton          = $( '#ps-live-debug-restore' ),
		restoreBackupData      = { 'action': 'ps-live-debug-restore-backup' },
		wpDebugToggle          = $( '#toggle-wp-debug' ),
		enableWPDebugData      = { 'action': 'ps-live-debug-enable' },
		disableWPDebugData     = { 'action': 'ps-live-debug-disable' },
		scriptDebugToggle      = $( '#toggle-script-debug' ),
		enableScriptDebugData  = { 'action': 'ps-live-debug-enable-script-debug' },
		disableScriptDebugData = { 'action': 'ps-live-debug-disable-script-debug' },
		savequeriesToggle      = $( '#toggle-savequeries' ),
		enableSavequeriesData  = { 'action': 'ps-live-debug-enable-savequeries' },
		disableSavequeriesData = { 'action': 'ps-live-debug-disable-savequeries' },
		checksumsData          = { 'action': 'ps-live-debug-tools-checksums-check' },
		checksumsDiffButton    = 'button[data-do=ps-live-debug-diff]',
		checksumsResponse      = $( '#checksums-response' ),
		checksumsResponseTitle = $( '#checksums-popup .sui-box-title' ),
		checksumsResponseBody  = $( '#checksums-popup .sui-box-body .diff-holder' ),
		mailCheckForm          = $( '#ps-live-debug-mail-check' ),
		serverInfo             = $( '#server-info' ),
		serverInfodata         = { 'action': 'ps-live-debug-server-info-server-info' },
		mysqlInfo              = $( '#mysql-info' ),
		mysqlInfodata          = { 'action': 'ps-live-debug-server-info-mysql-info' },
		phpInfo                = $( '#php-info' ),
		phpInfodata            = { 'action': 'ps-live-debug-server-info-php-info' },
		constantsInfo          = $( '#constants-info' ),
		constantsInfodata      = { 'action': 'ps-live-debug-wordpress-info-constants' },
		cronjobInfodata        = { 'action': 'ps-live-debug-cronjob-info-scheduled-events' },
		cronjobInfo            = $( '#cronjob-response' ),
		cronjobRunButton       = 'a[data-do=run-job]',
		cronjobRespHolder      = $( '.hookname' ),
		cronjobSuccess         = $( '#job-success' ),
		cronjobError           = $( '#job-error' ),
		sslForm                = $( '#check-ssl' ),
		sslHost                = $( '#ssl-host' ),
		sslResponse            = $( '#ssl-response' ),
		dirSize                = $( '#dir-size' ),
		dirSizeData            = { 'action': 'ps-live-debug-wordpress-info-installation-size' },
		dirPerm                = $( '#dir-perm' ),
		dirPermData            = { 'action': 'ps-live-debug-wordpress-info-directory-permissions' },
		genInfo                = $( '#gen-info' ),
		genInfoData            = { 'action': 'ps-live-debug-wordpress-info-general-information' },
		selectLog              = $( '#log-list' ),
		snapshotInfo           = $( '#psource-snapshot-info' ),
		snapshotInfodata       = { 'action': 'ps-live-debug-gather-snapshot-constants' },
		shipperInfo            = $( '#psource-shipper-info' ),
		shipperInfodata        = { 'action': 'ps-live-debug-gather-shipper-constants' };

	// Get Shipper Information
	if ( shipperInfo.length ) {
		$.post( ajaxurl, shipperInfodata, function( response ) {
			shipperInfo.html( response.data.message );
		} );
	}
	// Get Snapshot Information
	if ( snapshotInfo.length ) {
		$.post( ajaxurl, snapshotInfodata, function( response ) {
			snapshotInfo.html( response.data.message );
		} );
	}
	// Select different log
	selectLog.on( 'change', function( e ) {
		var log = $( this ).val(),
			nonce = $( this ).find(':selected').data( 'nonce' ),
			data;
		e.preventDefault();
		data = {
			'action': 'ps-live-debug-select-log',
			'log': log,
			'nonce': nonce
		};
		$.post( ajaxurl, data, function( response ) {
			if ( response.success ) {
				window.location.href = window.location.href;
			}
		} );
	} );
	// Get General Information
	if ( genInfo.length ) {
		$.post( ajaxurl, genInfoData, function( response ) {
			genInfo.html( response.data.message );
		} );
	}
	// Get Dir Size
	if ( dirPerm.length ) {
		$.post( ajaxurl, dirPermData, function( response ) {
			dirPerm.html( response.data.message );
		} );
	}
	// Get Dir Size
	if ( dirSize.length ) {
		$.post( ajaxurl, dirSizeData, function( response ) {
			dirSize.html( response.data.message );
		} );
	}
	// Get SSL Information
	var runSSLCheck = function() {
		var host = sslHost.val(),
			data;
		data = {
			'action': 'ps-live-debug-tools-ssl-information',
			'host': host
		};
		$.post( ajaxurl, data, function( response ) {
			if ( 'ready' === response.data.status || 'error' === response.data.status ) {
				sslResponse.html( response.data.message );
			} else {
				sslResponse.html( response.data.message );
				setTimeout( function() {
					runSSLCheck();
				}, 3000 );
			}
		} );
	};
	sslForm.submit( function( e ) {
		e.preventDefault();
		sslResponse.html( '<i class="sui-icon-loader sui-loading" aria-hidden="true"></i>' );
		runSSLCheck();
	} );
	// Run Cronjob
	cronjobInfo.on( 'click', cronjobRunButton, function( e ) {
		var hook = $( this ).data( 'hook' ),
			sig = $( this ).data( 'sig' ),
			nonce = $( this ).data( 'nonce' ),
			data;
		e.preventDefault();
		data = {
			'action': 'ps-live-debug-cronjob-info-run-event',
			'hook': hook,
			'sig': sig,
			'nonce': nonce
		};
		cronjobRespHolder.html( hook );
		$.post( ajaxurl, data, function( response ) {
			if ( response.success ) {
				cronjobSuccess.show();
			} else {
				cronjobError.show();
			}
		} );
	} );
	// Get Cronjobs
	if( cronjobInfo.length ) {
		$.post(	ajaxurl, cronjobInfodata, function( response ) {
			cronjobInfo.html( response.data.message );
		} );
	}
	// Server Info
	if ( serverInfo.length ) {
		$.post( ajaxurl, serverInfodata, function( response ) {
			serverInfo.html( response.data.message );
		} );
	}
	// MySQL Info
	if ( mysqlInfo.length ) {
		$.post( ajaxurl, mysqlInfodata, function( response ) {
			mysqlInfo.html( response.data.message );
		} );
	}
	// PHP Info
	if ( phpInfo.length ) {
		$.post( ajaxurl, phpInfodata, function( response ) {
			phpInfo.html( response.data.message );
		} );
	}
	// Constants Info
	if ( constantsInfo.length ) {
		$.post( ajaxurl, constantsInfodata, function( response ) {
			constantsInfo.html( response.data.message );
		} );
	}
	// Mail Check
	mailCheckForm.submit( function( e ) {
		var email = $( '#ps-live-debug-mail-check #email' ).val(),
			emailSubject = $( '#ps-live-debug-mail-check #email_subject' ).val(),
			emailMessage = $( '#ps-live-debug-mail-check #email_message' ).val(),
			data;
		e.preventDefault();
		$( '#mail-check-box' ).html('<i class="sui-icon-loader sui-loading" aria-hidden="true"></i>');
		data = {
			'action': 'ps-live-debug-tools-wp-mail',
			'email': email,
			'email_subject': emailSubject,
			'email_message': emailMessage
		};
		$.post( ajaxurl, data, function( response ) {
			$( '#mail-check-box' ).html( response.data.message );
		} );
	} );
	// Checksum Ajax
	if ( checksumsResponse.length ) {
		$.post(	ajaxurl, checksumsData, function( response ) {
			checksumsResponse.html( response.data.message );
		} );
	}
	// Checksum Diff
	checksumsResponse.on( 'click', checksumsDiffButton, function( e ) {
		var file = $( this ).data( 'file' ),
			data;
		e.preventDefault();
		data = {
			'action': 'ps-live-debug-tools-view-diff',
			'file': file
		};
		const cp = document.getElementById( 'checksums-popup' );
		const checksum = new A11yDialog( cp );
		checksumsResponseTitle.html( '' );
		checksumsResponseBody.html( '<i class="sui-icon-loader sui-loading" aria-hidden="true"></i>' );
		checksum.show();
		$.post( ajaxurl, data, function( response ) {
			checksumsResponseTitle.html( file );
			checksumsResponseBody.scrollTop( checksumsResponseBody[0] );
			checksumsResponseBody.html( response.data.message );
		} );
	} );
	// Scroll the textarea to bottom.
	function scrollDebugAreaToBottom() {
		debugArea.scrollTop( debugArea[0].scrollHeight );
	}
	// Debug View
	if ( debugArea.length ) {
		// Make the initial debug.log read.
		$.post( ajaxurl, refreshData, function( response ) {
			debugArea.html( response );
			scrollDebugAreaToBottom();
		} );
		// Enable / Disable Auto Scroll
		setInterval( function() {
			var checked = refreshToggle.is( ':checked' );
			if ( checked ) {
				$.post( ajaxurl, refreshData, function( response ) {
					debugArea.html( response );
					scrollDebugAreaToBottom();
				} );
			}
		}, 2000 );
		// Handle the clear button clicks.
		clearButton.on( 'click', function( e ) {
			var nonce = $( this ).data( 'nonce' ),
				log   = $( this ).data( 'log' ),
				data;
			e.preventDefault();
			$( this ).find( '.sui-icon-loader' ).css( 'display', 'inline-block' );
			data = {
				'action': 'ps-live-debug-clear-debug-log',
				'log': log,
				'nonce': nonce
			};
			$.post( ajaxurl, data, function( response ) {
				if ( response.success ) {
					$( clearButton ).find( '.sui-icon-loader' ).css( 'display', 'none' );
					scrollDebugAreaToBottom();
				}
			} );
		} );
		// Handle the delete button clicks.
		deleteButton.on( 'click', function( e ) {
			var nonce = $( this ).data( 'nonce' ),
				log   = $( this ).data( 'log' ),
				data;
			e.preventDefault();
			$( this ).find( '.sui-icon-loader' ).css( 'display', 'inline-block' );
			data = {
				'action': 'ps-live-debug-delete-debug-log',
				'log': log,
				'nonce': nonce
			}
			$.post( ajaxurl, data, function( response ) {
				if ( response.success ) {
					window.location.href = window.location.href;
				}
			} );
		} );
		// Create wp-config backup
		backupButton.on( 'click', function( e ) {
			e.preventDefault();
			$( this ).find( '.sui-icon-loader' ).css( 'display', 'inline-block' );
			$.post( ajaxurl, createBackupData, function( response ) {
				if ( response.success ) {
					window.location.href = window.location.href;
				} else {
					responseHolder.html( response.data.message );
				}
			} );
		} );
		// Restore wp-config backup
		restoreButton.on( 'click', function( e ) {
			e.preventDefault();
			$( this ).find( '.sui-icon-loader' ).css( 'display', 'inline-block' );
			$.post( ajaxurl, restoreBackupData, function( response ) {
				if ( response.success ) {
					window.location.href = window.location.href;
				} else {
					responseHolder.html( response.data.message );
				}
			} );
		} );
		// Enable / Disable WP DEDUG
		wpDebugToggle.on( 'change', function( e ) {
			e.preventDefault();
			var checked = $(this).is( ':checked');
			backupButton.prop( 'disabled', true );
			restoreButton.prop( 'disabled', true );
			wpDebugToggle.prop( 'disabled', true );
			scriptDebugToggle.prop( 'disabled', true );
			savequeriesToggle.prop( 'disabled', true );
			if ( checked ) {
				$.post( ajaxurl, enableWPDebugData, function( response ) {
					if ( response.success ) {
						backupButton.prop( 'disabled', false );
						restoreButton.prop( 'disabled', false );
						wpDebugToggle.prop( 'disabled', false );
						scriptDebugToggle.prop( 'disabled', false );
						savequeriesToggle.prop( 'disabled', false );
					}
				} );
			} else if ( ! checked ) {
				$.post( ajaxurl, disableWPDebugData, function( response ) {
					if ( response.success ) {
						backupButton.prop( 'disabled', false );
						restoreButton.prop( 'disabled', false );
						wpDebugToggle.prop( 'disabled', false );
						scriptDebugToggle.prop( 'disabled', false );
						savequeriesToggle.prop( 'disabled', false );
					}
				} );
			}
		} );
		// Enable / Disable SCRIPT DEDUG
		scriptDebugToggle.on( 'change', function( e ) {
			e.preventDefault();
			var checked = $(this).is( ':checked');
			backupButton.prop( 'disabled', true );
			restoreButton.prop( 'disabled', true );
			wpDebugToggle.prop( 'disabled', true );
			scriptDebugToggle.prop( 'disabled', true );
			savequeriesToggle.prop( 'disabled', true );
			if ( checked ) {
				$.post( ajaxurl, enableScriptDebugData, function( response ) {
					if ( response.success ) {
						backupButton.prop( 'disabled', false );
						restoreButton.prop( 'disabled', false );
						wpDebugToggle.prop( 'disabled', false );
						scriptDebugToggle.prop( 'disabled', false );
						savequeriesToggle.prop( 'disabled', false );
					}
				} );
			} else if ( ! checked ) {
				$.post( ajaxurl, disableScriptDebugData, function( response ) {
					if ( response.success ) {
						backupButton.prop( 'disabled', false );
						restoreButton.prop( 'disabled', false );
						wpDebugToggle.prop( 'disabled', false );
						scriptDebugToggle.prop( 'disabled', false );
						savequeriesToggle.prop( 'disabled', false );
					}
				} );
			}
		} );
		// Enable / Disable SAVEQUERIES
		savequeriesToggle.on( 'change', function( e ) {
			e.preventDefault();
			var checked = $(this).is( ':checked');
			backupButton.prop( 'disabled', true );
			restoreButton.prop( 'disabled', true );
			wpDebugToggle.prop( 'disabled', true );
			scriptDebugToggle.prop( 'disabled', true );
			savequeriesToggle.prop( 'disabled', true );
			if ( checked ) {
				$.post( ajaxurl, enableSavequeriesData, function( response ) {
					if ( response.success ) {
						backupButton.prop( 'disabled', false );
						restoreButton.prop( 'disabled', false );
						wpDebugToggle.prop( 'disabled', false );
						scriptDebugToggle.prop( 'disabled', false );
						savequeriesToggle.prop( 'disabled', false );
					}
				} );
			} else if ( ! checked ) {
				$.post( ajaxurl, disableSavequeriesData, function( response ) {
					if ( response.success ) {
						backupButton.prop( 'disabled', false );
						restoreButton.prop( 'disabled', false );
						wpDebugToggle.prop( 'disabled', false );
						scriptDebugToggle.prop( 'disabled', false );
						savequeriesToggle.prop( 'disabled', false );
					}
				} );
			}
		} );
	}
	// Safety Dialog
	if ( safetyPopup.length ) {
		const sp = document.getElementById( 'safety-popup' );
		const safety = new A11yDialog( sp );
		setTimeout( function() {
			safety.show();
		}, 300 );
		acceptRisk.on( 'click', function( e ) {
			e.preventDefault();
			safety.hide();
			$.post( ajaxurl, acceptRiskData, function( response ) {
				if ( ! response.success ) {
					responseHolder.html( response.data.message );
				}
			} );
		} );
	}
} )( jQuery );
