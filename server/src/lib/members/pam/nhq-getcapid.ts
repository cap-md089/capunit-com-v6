import { load } from 'cheerio';
import req from './nhq-request';

export default async (namerank: string, cookie: string, username: string): Promise<{
	capid: number,
	orgid: number
}> => {
	const page = await req('/preview/GatherEmails.aspx?t=a', cookie);

	const $ = load(page);

	let capid = 0;
	if (!username.match(/\d{6}/)) {
		const table = $('#gvEmails');

		const testNR = namerank.replace(/ /g, '');

		table.find('tr').each(function () {
			const texts = $(this).children().map(function () {
				return $(this).text().replace(/[ \n\r]/g, '');
			}).get();

			if (texts[2] === testNR) {
				capid = parseInt(texts[1], 10);
			}
		});
	} else {
		capid = parseInt(username, 10);
	}

	const menu = $('#nav');

	let orgid;

	menu.find('li').each(function() {
		const id = $(this).attr('data-popout-id');

		if (id === 'popout-Reports') {
			const otherResources = ($($($(this).children()[1]).children()[1]).children());
			const link = $($(otherResources).children()[2]).children();

			const href = link.attr('href');

			orgid = parseInt(href.match(/OID=(\d{1,4})/)[1], 10);
		}
	});

	return {
		capid,
		orgid
	};
};