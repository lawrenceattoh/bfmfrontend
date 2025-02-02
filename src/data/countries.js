const countryOptions = [
    { value: 'af', iso_a3: 'AFG', id: '004', label: 'Afghanistan', flag: '🇦🇫' },
    { value: 'al', iso_a3: 'ALB', id: '008', label: 'Albania', flag: '🇦🇱' },
    { value: 'dz', iso_a3: 'DZA', id: '012', label: 'Algeria', flag: '🇩🇿' },
    { value: 'as', iso_a3: 'ASM', id: '016', label: 'American Samoa', flag: '🇦🇸' },
    { value: 'ad', iso_a3: 'AND', id: '020', label: 'Andorra', flag: '🇦🇩' },
    { value: 'ao', iso_a3: 'AGO', id: '024', label: 'Angola', flag: '🇦🇴' },
    { value: 'ai', iso_a3: 'AIA', id: '660', label: 'Anguilla', flag: '🇦🇮' },
    { value: 'ag', iso_a3: 'ATG', id: '028', label: 'Antigua and Barbuda', flag: '🇦🇬' },
    { value: 'ar', iso_a3: 'ARG', id: '032', label: 'Argentina', flag: '🇦🇷' },
    { value: 'am', iso_a3: 'ARM', id: '051', label: 'Armenia', flag: '🇦🇲' },
    { value: 'au', iso_a3: 'AUS', id: '036', label: 'Australia', flag: '🇦🇺' },
    { value: 'at', iso_a3: 'AUT', id: '040', label: 'Austria', flag: '🇦🇹' },
    { value: 'az', iso_a3: 'AZE', id: '031', label: 'Azerbaijan', flag: '🇦🇿' },
    { value: 'bs', iso_a3: 'BHS', id: '044', label: 'Bahamas', flag: '🇧🇸' },
    { value: 'bh', iso_a3: 'BHR', id: '048', label: 'Bahrain', flag: '🇧🇭' },
    { value: 'bd', iso_a3: 'BGD', id: '050', label: 'Bangladesh', flag: '🇧🇩' },
    { value: 'bb', iso_a3: 'BRB', id: '052', label: 'Barbados', flag: '🇧🇧' },
    { value: 'by', iso_a3: 'BLR', id: '112', label: 'Belarus', flag: '🇧🇾' },
    { value: 'be', iso_a3: 'BEL', id: '056', label: 'Belgium', flag: '🇧🇪' },
    { value: 'bz', iso_a3: 'BLZ', id: '084', label: 'Belize', flag: '🇧🇿' },
    { value: 'bj', iso_a3: 'BEN', id: '204', label: 'Benin', flag: '🇧🇯' },
    { value: 'bt', iso_a3: 'BTN', id: '064', label: 'Bhutan', flag: '🇧🇹' },
    { value: 'bo', iso_a3: 'BOL', id: '068', label: 'Bolivia', flag: '🇧🇴' },
    { value: 'ba', iso_a3: 'BIH', id: '070', label: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { value: 'bw', iso_a3: 'BWA', id: '072', label: 'Botswana', flag: '🇧🇼' },
    { value: 'br', iso_a3: 'BRA', id: '076', label: 'Brazil', flag: '🇧🇷' },
    { value: 'bn', iso_a3: 'BRN', id: '096', label: 'Brunei', flag: '🇧🇳' },
    { value: 'bg', iso_a3: 'BGR', id: '100', label: 'Bulgaria', flag: '🇧🇬' },
    { value: 'bf', iso_a3: 'BFA', id: '854', label: 'Burkina Faso', flag: '🇧🇫' },
    { value: 'bi', iso_a3: 'BDI', id: '108', label: 'Burundi', flag: '🇧🇮' },
    { value: 'kh', iso_a3: 'KHM', id: '116', label: 'Cambodia', flag: '🇰🇭' },
    { value: 'cm', iso_a3: 'CMR', id: '120', label: 'Cameroon', flag: '🇨🇲' },
    { value: 'ca', iso_a3: 'CAN', id: '124', label: 'Canada', flag: '🇨🇦' },
    { value: 'cv', iso_a3: 'CPV', id: '132', label: 'Cape Verde', flag: '🇨🇻' },
    { value: 'cf', iso_a3: 'CAF', id: '140', label: 'Central African Republic', flag: '🇨🇫' },
    { value: 'td', iso_a3: 'TCD', id: '148', label: 'Chad', flag: '🇹🇩' },
    { value: 'cl', iso_a3: 'CHL', id: '152', label: 'Chile', flag: '🇨🇱' },
    { value: 'cn', iso_a3: 'CHN', id: '156', label: 'China', flag: '🇨🇳' },
    { value: 'co', iso_a3: 'COL', id: '170', label: 'Colombia', flag: '🇨🇴' },
    { value: 'km', iso_a3: 'COM', id: '174', label: 'Comoros', flag: '🇰🇲' },
    { value: 'cg', iso_a3: 'COG', id: '178', label: 'Congo', flag: '🇨🇬' },
    { value: 'cd', iso_a3: 'COD', id: '180', label: 'Congo (DRC)', flag: '🇨🇩' },
    { value: 'cr', iso_a3: 'CRI', id: '188', label: 'Costa Rica', flag: '🇨🇷' },
    { value: 'ci', iso_a3: 'CIV', id: '384', label: 'Côte d’Ivoire', flag: '🇨🇮' },
    { value: 'hr', iso_a3: 'HRV', id: '191', label: 'Croatia', flag: '🇭🇷' },
    { value: 'cu', iso_a3: 'CUB', id: '192', label: 'Cuba', flag: '🇨🇺' },
    { value: 'cy', iso_a3: 'CYP', id: '196', label: 'Cyprus', flag: '🇨🇾' },
    { value: 'cz', iso_a3: 'CZE', id: '203', label: 'Czechia', flag: '🇨🇿' },
    { value: 'dk', iso_a3: 'DNK', id: '208', label: 'Denmark', flag: '🇩🇰' },
    { value: 'dj', iso_a3: 'DJI', id: '262', label: 'Djibouti', flag: '🇩🇯' },
    { value: 'dm', iso_a3: 'DMA', id: '212', label: 'Dominica', flag: '🇩🇲' },
    { value: 'do', iso_a3: 'DOM', id: '214', label: 'Dominican Republic', flag: '🇩🇴' },
    { value: 'ec', iso_a3: 'ECU', id: '218', label: 'Ecuador', flag: '🇪🇨' },
    { value: 'eg', iso_a3: 'EGY', id: '818', label: 'Egypt', flag: '🇪🇬' },
    { value: 'sv', iso_a3: 'SLV', id: '222', label: 'El Salvador', flag: '🇸🇻' },
    { value: 'gq', iso_a3: 'GNQ', id: '226', label: 'Equatorial Guinea', flag: '🇬🇶' },
    { value: 'er', iso_a3: 'ERI', id: '232', label: 'Eritrea', flag: '🇪🇷' },
    { value: 'ee', iso_a3: 'EST', id: '233', label: 'Estonia', flag: '🇪🇪' },
    { value: 'sz', iso_a3: 'SWZ', id: '748', label: 'Eswatini', flag: '🇸🇿' },
    { value: 'et', iso_a3: 'ETH', id: '231', label: 'Ethiopia', flag: '🇪🇹' },
    { value: 'fj', iso_a3: 'FJI', id: '242', label: 'Fiji', flag: '🇫🇯' },
    { value: 'fi', iso_a3: 'FIN', id: '246', label: 'Finland', flag: '🇫🇮' },
    { value: 'fr', iso_a3: 'FRA', id: '250', label: 'France', flag: '🇫🇷' },
    { value: 'ga', iso_a3: 'GAB', id: '266', label: 'Gabon', flag: '🇬🇦' },
    { value: 'gm', iso_a3: 'GMB', id: '270', label: 'Gambia', flag: '🇬🇲' },
    { value: 'ge', iso_a3: 'GEO', id: '268', label: 'Georgia', flag: '🇬🇪' },
    { value: 'de', iso_a3: 'DEU', id: '276', label: 'Germany', flag: '🇩🇪' },
    { value: 'gh', iso_a3: 'GHA', id: '288', label: 'Ghana', flag: '🇬🇭' },
    { value: 'gr', iso_a3: 'GRC', id: '300', label: 'Greece', flag: '🇬🇷' },
    { value: 'gt', iso_a3: 'GTM', id: '320', label: 'Guatemala', flag: '🇬🇹' },
    { value: 'gn', iso_a3: 'GIN', id: '324', label: 'Guinea', flag: '🇬🇳' },
    { value: 'gw', iso_a3: 'GNB', id: '624', label: 'Guinea-Bissau', flag: '🇬🇼' },
    { value: 'gy', iso_a3: 'GUY', id: '328', label: 'Guyana', flag: '🇬🇾' },
    { value: 'ht', iso_a3: 'HTI', id: '332', label: 'Haiti', flag: '🇭🇹' },
    { value: 'hn', iso_a3: 'HND', id: '340', label: 'Honduras', flag: '🇭🇳' },
    { value: 'hu', iso_a3: 'HUN', id: '348', label: 'Hungary', flag: '🇭🇺' },
    { value: 'is', iso_a3: 'ISL', id: '352', label: 'Iceland', flag: '🇮🇸' },
    { value: 'in', iso_a3: 'IND', id: '356', label: 'India', flag: '🇮🇳' },
    { value: 'id', iso_a3: 'IDN', id: '360', label: 'Indonesia', flag: '🇮🇩' },
    { value: 'ir', iso_a3: 'IRN', id: '364', label: 'Iran', flag: '🇮🇷' },
    { value: 'iq', iso_a3: 'IRQ', id: '368', label: 'Iraq', flag: '🇮🇶' },
    { value: 'ie', iso_a3: 'IRL', id: '372', label: 'Ireland', flag: '🇮🇪' },
    { value: 'il', iso_a3: 'ISR', id: '376', label: 'Israel', flag: '🇮🇱' },
    { value: 'it', iso_a3: 'ITA', id: '380', label: 'Italy', flag: '🇮🇹' },
    { value: 'jm', iso_a3: 'JAM', id: '388', label: 'Jamaica', flag: '🇯🇲' },
    { value: 'jp', iso_a3: 'JPN', id: '392', label: 'Japan', flag: '🇯🇵' },
    { value: 'jo', iso_a3: 'JOR', id: '400', label: 'Jordan', flag: '🇯🇴' },
    { value: 'kz', iso_a3: 'KAZ', id: '398', label: 'Kazakhstan', flag: '🇰🇿' },
    { value: 'ke', iso_a3: 'KEN', id: '404', label: 'Kenya', flag: '🇰🇪' },
    { value: 'kr', iso_a3: 'KOR', id: '410', label: 'South Korea', flag: '🇰🇷' },
    { value: 'kw', iso_a3: 'KWT', id: '414', label: 'Kuwait', flag: '🇰🇼' },
    { value: 'kg', iso_a3: 'KGZ', id: '417', label: 'Kyrgyzstan', flag: '🇰🇬' },
    { value: 'la', iso_a3: 'LAO', id: '418', label: 'Laos', flag: '🇱🇦' },
    { value: 'lv', iso_a3: 'LVA', id: '428', label: 'Latvia', flag: '🇱🇻' },
    { value: 'lb', iso_a3: 'LBN', id: '422', label: 'Lebanon', flag: '🇱🇧' },
    { value: 'ls', iso_a3: 'LSO', id: '426', label: 'Lesotho', flag: '🇱🇸' },
    { value: 'lr', iso_a3: 'LBR', id: '430', label: 'Liberia', flag: '🇱🇷' },
    { value: 'ly', iso_a3: 'LBY', id: '434', label: 'Libya', flag: '🇱🇾' },
    { value: 'lt', iso_a3: 'LTU', id: '440', label: 'Lithuania', flag: '🇱🇹' },
    { value: 'lu', iso_a3: 'LUX', id: '442', label: 'Luxembourg', flag: '🇱🇺' },
    { value: 'mg', iso_a3: 'MDG', id: '450', label: 'Madagascar', flag: '🇲🇬' },
    { value: 'mw', iso_a3: 'MWI', id: '454', label: 'Malawi', flag: '🇲🇼' },
    { value: 'my', iso_a3: 'MYS', id: '458', label: 'Malaysia', flag: '🇲🇾' },
    { value: 'mv', iso_a3: 'MDV', id: '462', label: 'Maldives', flag: '🇲🇻' },
    { value: 'ml', iso_a3: 'MLI', id: '466', label: 'Mali', flag: '🇲🇱' },
    { value: 'mt', iso_a3: 'MLT', id: '470', label: 'Malta', flag: '🇲🇹' },
    { value: 'mr', iso_a3: 'MRT', id: '478', label: 'Mauritania', flag: '🇲🇷' },
    { value: 'mu', iso_a3: 'MUS', id: '480', label: 'Mauritius', flag: '🇲🇺' },
    { value: 'mx', iso_a3: 'MEX', id: '484', label: 'Mexico', flag: '🇲🇽' },
    { value: 'md', iso_a3: 'MDA', id: '498', label: 'Moldova', flag: '🇲🇩' },
    { value: 'mc', iso_a3: 'MCO', id: '492', label: 'Monaco', flag: '🇲🇨' },
    { value: 'mn', iso_a3: 'MNG', id: '496', label: 'Mongolia', flag: '🇲🇳' },
    { value: 'me', iso_a3: 'MNE', id: '499', label: 'Montenegro', flag: '🇲🇪' },
    { value: 'ma', iso_a3: 'MAR', id: '504', label: 'Morocco', flag: '🇲🇦' },
    { value: 'mz', iso_a3: 'MOZ', id: '508', label: 'Mozambique', flag: '🇲🇿' },
    { value: 'mm', iso_a3: 'MMR', id: '104', label: 'Myanmar', flag: '🇲🇲' },
    { value: 'na', iso_a3: 'NAM', id: '516', label: 'Namibia', flag: '🇳🇦' },
    { value: 'np', iso_a3: 'NPL', id: '524', label: 'Nepal', flag: '🇳🇵' },
    { value: 'nl', iso_a3: 'NLD', id: '528', label: 'Netherlands', flag: '🇳🇱' },
    { value: 'nz', iso_a3: 'NZL', id: '554', label: 'New Zealand', flag: '🇳🇿' },
    { value: 'ni', iso_a3: 'NIC', id: '558', label: 'Nicaragua', flag: '🇳🇮' },
    { value: 'ne', iso_a3: 'NER', id: '562', label: 'Niger', flag: '🇳🇪' },
    { value: 'ng', iso_a3: 'NGA', id: '566', label: 'Nigeria', flag: '🇳🇬' },
    { value: 'no', iso_a3: 'NOR', id: '578', label: 'Norway', flag: '🇳🇴' },
    { value: 'om', iso_a3: 'OMN', id: '512', label: 'Oman', flag: '🇴🇲' },
    { value: 'pk', iso_a3: 'PAK', id: '586', label: 'Pakistan', flag: '🇵🇰' },
    { value: 'pa', iso_a3: 'PAN', id: '591', label: 'Panama', flag: '🇵🇦' },
    { value: 'pg', iso_a3: 'PNG', id: '598', label: 'Papua New Guinea', flag: '🇵🇬' },
    { value: 'py', iso_a3: 'PRY', id: '600', label: 'Paraguay', flag: '🇵🇾' },
    { value: 'pe', iso_a3: 'PER', id: '604', label: 'Peru', flag: '🇵🇪' },
    { value: 'ph', iso_a3: 'PHL', id: '608', label: 'Philippines', flag: '🇵🇭' },
    { value: 'pl', iso_a3: 'POL', id: '616', label: 'Poland', flag: '🇵🇱' },
    { value: 'pt', iso_a3: 'PRT', id: '620', label: 'Portugal', flag: '🇵🇹' },
    { value: 'qa', iso_a3: 'QAT', id: '634', label: 'Qatar', flag: '🇶🇦' },
    { value: 'ro', iso_a3: 'ROU', id: '642', label: 'Romania', flag: '🇷🇴' },
    { value: 'ru', iso_a3: 'RUS', id: '643', label: 'Russia', flag: '🇷🇺' },
    { value: 'rw', iso_a3: 'RWA', id: '646', label: 'Rwanda', flag: '🇷🇼' },
    { value: 'kn', iso_a3: 'KNA', id: '659', label: 'Saint Kitts and Nevis', flag: '🇰🇳' },
    { value: 'lc', iso_a3: 'LCA', id: '662', label: 'Saint Lucia', flag: '🇱🇨' },
    { value: 'vc', iso_a3: 'VCT', id: '670', label: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
    { value: 'ws', iso_a3: 'WSM', id: '882', label: 'Samoa', flag: '🇼🇸' },
    { value: 'sm', iso_a3: 'SMR', id: '674', label: 'San Marino', flag: '🇸🇲' },
    { value: 'st', iso_a3: 'STP', id: '678', label: 'Sao Tome and Principe', flag: '🇸🇹' },
    { value: 'sa', iso_a3: 'SAU', id: '682', label: 'Saudi Arabia', flag: '🇸🇦' },
    { value: 'sn', iso_a3: 'SEN', id: '686', label: 'Senegal', flag: '🇸🇳' },
    { value: 'rs', iso_a3: 'SRB', id: '688', label: 'Serbia', flag: '🇷🇸' },
    { value: 'sc', iso_a3: 'SYC', id: '690', label: 'Seychelles', flag: '🇸🇨' },
    { value: 'sl', iso_a3: 'SLE', id: '694', label: 'Sierra Leone', flag: '🇸🇱' },
    { value: 'sg', iso_a3: 'SGP', id: '702', label: 'Singapore', flag: '🇸🇬' },
    { value: 'sk', iso_a3: 'SVK', id: '703', label: 'Slovakia', flag: '🇸🇰' },
    { value: 'si', iso_a3: 'SVN', id: '705', label: 'Slovenia', flag: '🇸🇮' },
    { value: 'sb', iso_a3: 'SLB', id: '090', label: 'Solomon Islands', flag: '🇸🇧' },
    { value: 'so', iso_a3: 'SOM', id: '706', label: 'Somalia', flag: '🇸🇴' },
    { value: 'za', iso_a3: 'ZAF', id: '710', label: 'South Africa', flag: '🇿🇦' },
    { value: 'ss', iso_a3: 'SSD', id: '728', label: 'South Sudan', flag: '🇸🇸' },
    { value: 'es', iso_a3: 'ESP', id: '724', label: 'Spain', flag: '🇪🇸' },
    { value: 'lk', iso_a3: 'LKA', id: '144', label: 'Sri Lanka', flag: '🇱🇰' },
    { value: 'sd', iso_a3: 'SDN', id: '729', label: 'Sudan', flag: '🇸🇩' },
    { value: 'sr', iso_a3: 'SUR', id: '740', label: 'Suriname', flag: '🇸🇷' },
    { value: 'se', iso_a3: 'SWE', id: '752', label: 'Sweden', flag: '🇸🇪' },
    { value: 'ch', iso_a3: 'CHE', id: '756', label: 'Switzerland', flag: '🇨🇭' },
    { value: 'sy', iso_a3: 'SYR', id: '760', label: 'Syria', flag: '🇸🇾' },
    { value: 'tw', iso_a3: 'TWN', id: '158', label: 'Taiwan', flag: '🇹🇼' },
    { value: 'tj', iso_a3: 'TJK', id: '762', label: 'Tajikistan', flag: '🇹🇯' },
    { value: 'tz', iso_a3: 'TZA', id: '834', label: 'Tanzania', flag: '🇹🇿' },
    { value: 'th', iso_a3: 'THA', id: '764', label: 'Thailand', flag: '🇹🇭' },
    { value: 'tg', iso_a3: 'TGO', id: '768', label: 'Togo', flag: '🇹🇬' },
    { value: 'to', iso_a3: 'TON', id: '776', label: 'Tonga', flag: '🇹🇴' },
    { value: 'tt', iso_a3: 'TTO', id: '780', label: 'Trinidad and Tobago', flag: '🇹🇹' },
    { value: 'tn', iso_a3: 'TUN', id: '788', label: 'Tunisia', flag: '🇹🇳' },
    { value: 'tr', iso_a3: 'TUR', id: '792', label: 'Turkey', flag: '🇹🇷' },
    { value: 'tm', iso_a3: 'TKM', id: '795', label: 'Turkmenistan', flag: '🇹🇲' },
    { value: 'tv', iso_a3: 'TUV', id: '798', label: 'Tuvalu', flag: '🇹🇻' },
    { value: 'ug', iso_a3: 'UGA', id: '800', label: 'Uganda', flag: '🇺🇬' },
    { value: 'ua', iso_a3: 'UKR', id: '804', label: 'Ukraine', flag: '🇺🇦' },
    { value: 'ae', iso_a3: 'ARE', id: '784', label: 'United Arab Emirates', flag: '🇦🇪' },
    { value: 'gb', iso_a3: 'GBR', id: '826', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'us', iso_a3: 'USA', id: '840', label: 'United States', flag: '🇺🇸' },
    { value: 'uy', iso_a3: 'URY', id: '858', label: 'Uruguay', flag: '🇺🇾' },
    { value: 'uz', iso_a3: 'UZB', id: '860', label: 'Uzbekistan', flag: '🇺🇿' },
    { value: 'vu', iso_a3: 'VUT', id: '548', label: 'Vanuatu', flag: '🇻🇺' },
    { value: 've', iso_a3: 'VEN', id: '862', label: 'Venezuela', flag: '🇻🇪' },
    { value: 'vn', iso_a3: 'VNM', id: '704', label: 'Vietnam', flag: '🇻🇳' },
    { value: 'ye', iso_a3: 'YEM', id: '887', label: 'Yemen', flag: '🇾🇪' },
    { value: 'zm', iso_a3: 'ZMB', id: '894', label: 'Zambia', flag: '🇿🇲' },
    { value: 'zw', iso_a3: 'ZWE', id: '716', label: 'Zimbabwe', flag: '🇿🇼' },
];
// Regions
const regions = {
    NorthAmerica: ['ca', 'us', 'mx', 'bz', 'cr', 'gt', 'hn', 'ni', 'pa', 'sv'],
    SouthAmerica: [
        'ar', 'bo', 'br', 'cl', 'co', 'ec', 'gy', 'pe', 'py', 'sr', 'uy', 've'
    ],
    Europe: [
        'al', 'ad', 'am', 'at', 'az', 'by', 'be', 'ba', 'bg', 'hr', 'cy', 'cz',
        'dk', 'ee', 'fi', 'fr', 'ge', 'de', 'gr', 'hu', 'is', 'ie', 'it', 'kz',
        'xk', 'lv', 'li', 'lt', 'lu', 'mt', 'md', 'mc', 'me', 'nl', 'mk', 'no',
        'pl', 'pt', 'ro', 'ru', 'sm', 'rs', 'sk', 'si', 'es', 'se', 'ch', 'tr',
        'ua', 'gb', 'va'
    ],
    Africa: [
        'dz', 'ao', 'bj', 'bw', 'bf', 'bi', 'cm', 'cv', 'cf', 'td', 'km', 'cg',
        'cd', 'dj', 'eg', 'gq', 'er', 'sz', 'et', 'ga', 'gm', 'gh', 'gn', 'gw',
        'ci', 'ke', 'ls', 'lr', 'ly', 'mg', 'mw', 'ml', 'mr', 'mu', 'ma', 'mz',
        'na', 'ne', 'ng', 'rw', 'st', 'sn', 'sc', 'sl', 'so', 'za', 'ss', 'sd',
        'tz', 'tg', 'tn', 'ug', 'zm', 'zw'
    ],
    Asia: [
        'af', 'az', 'bh', 'bd', 'bt', 'bn', 'kh', 'cn', 'cy', 'ge', 'in', 'id',
        'ir', 'iq', 'il', 'jp', 'jo', 'kz', 'kr', 'kw', 'kg', 'la', 'lb', 'my',
        'mv', 'mn', 'mm', 'np', 'om', 'pk', 'ph', 'qa', 'sa', 'sg', 'lk', 'sy',
        'tw', 'tj', 'th', 'tl', 'tr', 'tm', 'ae', 'uz', 'vn', 'ye'
    ],
    Oceania: [
        'as', 'au', 'ck', 'fj', 'pf', 'gu', 'ki', 'mh', 'fm', 'nr', 'nc', 'nz',
        'pw', 'pg', 'ws', 'sb', 'to', 'tv', 'vu'
    ],
    Antarctica: ['aq', 'bv', 'gs', 'hm', 'tf'],
};
export {regions, countryOptions}