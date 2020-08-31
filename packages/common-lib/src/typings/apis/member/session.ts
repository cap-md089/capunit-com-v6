/**
 * Copyright (C) 2020 Andrew Rioux
 *
 * This file is part of CAPUnit.com.
 *
 * CAPUnit.com is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * CAPUnit.com is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CAPUnit.com.  If not, see <http://www.gnu.org/licenses/>.
 */

import { APIEither } from '../../api';
import { MemberReference, RegularSession, ScanAddSession } from '../../types';

/**
 * Developer tool, strictly locked down
 */
export interface Su {
	(params: {}, body: MemberReference): APIEither<void>;

	url: '/api/member/session/su';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: true;
}

/**
 * Developer tool, strictly locked down
 *
 * Clones the current session, returning a session ID to the new
 * session. Allows for creating a new session without signing in
 */
export interface Clone {
	(params: {}, body: {}): APIEither<string>;

	url: '/api/member/session/clone';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: false;
}

/**
 * Makes a request to downgrade a session to a ScanAdd session for a specific event
 */
export interface SetScanAddSession {
	(params: {}, body: { eventID: number }): APIEither<ScanAddSession>;

	url: '/api/member/session/scanadd';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: true;
}

/**
 * Makes a request to upgrade a session to a regular session after the session was
 * initially denied to allow for Multi-Factor Authentication (MFA)
 */
export interface FinishMFA {
	(params: {}, body: { mfaToken: string }): APIEither<RegularSession>;

	url: '/api/member/session/finishmfa';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: true;
}

/**
 * Starts the process of allowing a user to use MFA for their account
 */
export interface StartMFASetup {
	(params: {}, body: {}): APIEither<string>;

	url: '/api/member/session/startmfasetup';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: false;
}

/**
 * Makes a request to finish setting up an MFA session for a user
 */
export interface FinishMFASetup {
	(
		params: {},
		body: {
			mfaToken: string;
		},
	): APIEither<void>;

	url: '/api/member/session/finishmfasetup';

	method: 'post';

	requiresMember: 'required';

	needsToken: true;

	useValidator: true;
}
