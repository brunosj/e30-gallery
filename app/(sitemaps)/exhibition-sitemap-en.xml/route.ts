import { buildExhibitionPartitionXml } from '@/app/utils/sitemapPartitions'
import { xmlResponse } from '@/app/utils/sitemapXml'

export async function GET() {
  return xmlResponse(await buildExhibitionPartitionXml('en'))
}
