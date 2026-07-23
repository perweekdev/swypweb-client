import { Suspense } from 'react';
import { CollectionEditor } from '@components/collection/collection-editor';

/** COL-003 컬렉션 편집 (편집 대상 그룹은 `?group=` 쿼리로 받는다) */
export default function CollectionEditPage() {
  return (
    <Suspense>
      <CollectionEditor />
    </Suspense>
  );
}
