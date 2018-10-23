export enum EventStatus {
	DRAFT,
	TENTATIVE,
	CONFIRMED,
	COMPLETE,
	CANCELLED,
	INFORMATIONONLY
}

export enum MemberCreateError {
	NONE = -1,
	INCORRRECT_CREDENTIALS = 0,
	SERVER_ERROR = 1,
	PASSWORD_EXPIRED = 2,
	INVALID_SESSION_ID = 3,
	UNKOWN_SERVER_ERROR = 4
}

export enum PointOfContactType {
	INTERNAL,
	EXTERNAL
}

export enum TeamPublicity {
	PRIVATE, // Nothing visible, not shown on Browse unless signed in and member of team
	PUBLIC // Full visibility
}

export enum MemberCAPWATCHErrors {
	INVALID_PERMISSIONS,
	NO_NHQ_ACTION
}

export enum CAPWATCHImportErrors {
	NONE,
	BADDATA,
	INSERT,
	CLEAR
}

export enum AttendanceStatus {
	COMMITTEDATTENDED,
	NOSHOW,
	RESCINDEDCOMMITMENTTOATTEND
}

// http://www.ntfs.com/ntfs-permissions-file-folder.htm
export enum FileUserAccessControlPermissions {
	// Read for a folder includes the ability to see files inside of it
	READ = 1,
	// Write, for folders, means changing name and uploading files
	// For files, maybe at some point there will be a way to
	// overwrite
	// tslint:disable-next-line:no-bitwise
	WRITE = 1 << 1,
	// tslint:disable-next-line:no-bitwise
	COMMENT = 1 << 2,
	// tslint:disable-next-line:no-bitwise
	MODIFY = 1 << 3,
	// tslint:disable-next-line:no-bitwise
	DELETE = 1 << 4,
	// tslint:disable-next-line:no-bitwise
	ASSIGNPERMISSIONS = 1 << 5,
	FULLCONTROL = 255
}

export enum FileUserAccessControlType {
	USER,
	TEAM,
	ACCOUNTMEMBER,
	SIGNEDIN,
	OTHER
}