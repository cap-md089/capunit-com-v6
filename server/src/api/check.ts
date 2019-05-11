import { SigninReturn } from 'common-lib';
import { MemberCreateError } from 'common-lib/index';
import * as express from 'express';
import { ConditionalMemberRequest } from '../lib/MemberBase';
import { json } from '../lib/Util';

export default async (req: ConditionalMemberRequest, res: express.Response) => {
	if (!!req.member) {
		json<SigninReturn>(res, {
			error: MemberCreateError.NONE,
			sessionID: req.member.sessionID,
			member: req.member.toRaw(),
			valid: true,
			notificationCount: await req.member.getUnreadNotificationCount(),
			taskCount: 0
		});
	} else {
		json<SigninReturn>(res, {
			error: MemberCreateError.INVALID_SESSION_ID,
			valid: false,
			sessionID: '',
			member: null,
			notificationCount: 0,
			taskCount: 0
		});
	}
};
